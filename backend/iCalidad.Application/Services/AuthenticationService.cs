using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using iCalidad.Application.Common.Interfaces;
using iCalidad.Application.DTOs;

namespace iCalidad.Application.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IApplicationDbContext _context;
        private readonly ITokenService _tokenService;
        private readonly IEmailService? _emailService;
        private readonly string _signingSecret;

        public AuthenticationService(
            IApplicationDbContext context,
            ITokenService tokenService,
            IEmailService? emailService = null)
        {
            _context = context;
            _tokenService = tokenService;
            _emailService = emailService;
            _signingSecret = Environment.GetEnvironmentVariable("JWT_SECRET")
                ?? "ClaveSuperSecretaDeiCalidad2026!DebeTenerAlMenos256BitsDeLargoParaSeguridad";
        }

        public async Task<AuthResponse?> AuthenticateAsync(LoginRequest request)
        {
            // 1. Buscar empleado por nombre de usuario (sin distinción de mayúsculas/minúsculas)
            var empleado = await _context.Empleados
                .FirstOrDefaultAsync(e => e.UserName.ToLower() == request.Username.ToLower());

            if (empleado == null)
            {
                return null;
            }

            // 2. Validar estatus activo
            if (!empleado.IdEstatusEmpleado)
            {
                return null;
            }

            // 3. Validar contraseña (soporta tanto hashes BCrypt como texto plano heredado de la BD actual)
            if (!VerifyPassword(request.Password, empleado.Password))
            {
                return null;
            }

            // 4. Obtener roles asociados al empleado
            var rolesData = await _context.EmpleadosRoles
                .Where(er => er.IdEmpleado == empleado.IdEmpleado)
                .Select(er => new { er.IdRol, er.Rol.NombreRol })
                .ToListAsync();

            var rolesList = rolesData.Select(r => r.NombreRol).ToList();
            var primaryRole = rolesData.FirstOrDefault();

            // 5. Generar token JWT firmado
            var token = _tokenService.GenerateToken(empleado, rolesList);

            return new AuthResponse
            {
                IdEmpleado = empleado.IdEmpleado,
                NombreEmpleado = empleado.NombreEmpleado,
                UserName = empleado.UserName,
                Correo = empleado.Correo,
                ImageEmpleado = empleado.ImageEmpleado,
                IdRol = primaryRole?.IdRol ?? 0,
                NombreRol = primaryRole?.NombreRol ?? string.Empty,
                Roles = rolesList,
                Token = token
            };
        }

        private static bool VerifyPassword(string providedPassword, string storedPassword)
        {
            if (string.IsNullOrEmpty(storedPassword) || string.IsNullOrEmpty(providedPassword))
            {
                return false;
            }

            // Si la contraseña almacenada es un hash BCrypt válido ($2a$, $2b$, $2y$)
            if (storedPassword.StartsWith("$2a$") || storedPassword.StartsWith("$2b$") || storedPassword.StartsWith("$2y$"))
            {
                try
                {
                    return BCrypt.Net.BCrypt.Verify(providedPassword, storedPassword);
                }
                catch
                {
                    return false;
                }
            }

            // Fallback para contraseñas en texto plano de la base de datos actual
            return storedPassword == providedPassword;
        }

        public async Task<PasswordRecoveryResult> ForgotPasswordAsync(ForgotPasswordRequest request)
        {
            const string genericMessage =
                "Si el usuario o correo existe y está activo, recibirás instrucciones para restablecer tu contraseña.";

            var identifier = request.Identifier.Trim().ToLower();
            var empleado = await _context.Empleados
                .FirstOrDefaultAsync(e =>
                    e.IdEstatusEmpleado &&
                    (e.UserName.ToLower() == identifier ||
                     (e.Correo != null && e.Correo.ToLower() == identifier)));

            if (empleado == null || string.IsNullOrWhiteSpace(empleado.Correo) || _emailService == null)
            {
                return new PasswordRecoveryResult { Success = true, Message = genericMessage };
            }

            var expiresAt = DateTimeOffset.UtcNow.AddMinutes(15).ToUnixTimeSeconds();
            var fingerprint = ComputePasswordFingerprint(empleado.Password);
            var payload = $"{empleado.IdEmpleado}|{expiresAt}|{fingerprint}";
            var signature = ComputeHmac(payload);
            var token = Base64UrlEncode($"{payload}|{signature}");

            var baseUrl = string.IsNullOrWhiteSpace(request.ResetBaseUrl)
                ? "https://icalidad.eliconacento.com/login/restablecer"
                : request.ResetBaseUrl.TrimEnd('/');
            var resetUrl = $"{baseUrl}?token={Uri.EscapeDataString(token)}";

            var htmlBody = $@"
                <div style=""font-family: Inter, Arial, sans-serif; color: #1e2328; max-width: 520px; margin: 0 auto;"">
                  <h2 style=""color: #199ed4;"">Recuperación de contraseña - iCalidad</h2>
                  <p>Hola <strong>{System.Net.WebUtility.HtmlEncode(empleado.NombreEmpleado)}</strong>,</p>
                  <p>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el siguiente botón (válido por 15 minutos):</p>
                  <p style=""margin: 24px 0;"">
                    <a href=""{resetUrl}"" style=""background-color: #199ed4; color: #ffffff; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600;"">
                      Restablecer contraseña
                    </a>
                  </p>
                  <p style=""font-size: 12px; color: #46505a;"">Si no solicitaste este cambio, puedes ignorar este correo.</p>
                </div>";

            await _emailService.SendEmailAsync(
                empleado.Correo,
                "iCalidad - Restablecer contraseña",
                htmlBody);

            return new PasswordRecoveryResult { Success = true, Message = genericMessage };
        }

        public async Task<PasswordRecoveryResult> ResetPasswordAsync(ResetPasswordRequest request)
        {
            if (!TryParseResetToken(request.Token, out var idEmpleado, out var expiresAt, out var fingerprint))
            {
                return new PasswordRecoveryResult
                {
                    Success = false,
                    Message = "El enlace de recuperación es inválido o ha expirado."
                };
            }

            if (DateTimeOffset.UtcNow.ToUnixTimeSeconds() > expiresAt)
            {
                return new PasswordRecoveryResult
                {
                    Success = false,
                    Message = "El enlace de recuperación ha expirado. Solicita uno nuevo."
                };
            }

            var empleado = await _context.Empleados
                .FirstOrDefaultAsync(e => e.IdEmpleado == idEmpleado && e.IdEstatusEmpleado);

            if (empleado == null || ComputePasswordFingerprint(empleado.Password) != fingerprint)
            {
                return new PasswordRecoveryResult
                {
                    Success = false,
                    Message = "El enlace de recuperación ya fue utilizado o no es válido."
                };
            }

            empleado.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            empleado.FechaActualiza = DateTime.UtcNow;
            empleado.IdEmpleadoActualiza = empleado.IdEmpleado;

            await _context.SaveChangesAsync();

            return new PasswordRecoveryResult
            {
                Success = true,
                Message = "Tu contraseña ha sido actualizada correctamente. Ya puedes iniciar sesión."
            };
        }

        private string ComputeHmac(string payload)
        {
            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_signingSecret));
            var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
            return Convert.ToHexString(hash);
        }

        private static string ComputePasswordFingerprint(string password)
        {
            var hash = SHA256.HashData(Encoding.UTF8.GetBytes(password ?? string.Empty));
            return Convert.ToHexString(hash)[..12];
        }

        private bool TryParseResetToken(string token, out int idEmpleado, out long expiresAt, out string fingerprint)
        {
            idEmpleado = 0;
            expiresAt = 0;
            fingerprint = string.Empty;

            try
            {
                var decoded = Base64UrlDecode(token);
                var parts = decoded.Split('|');
                if (parts.Length != 4) return false;

                if (!int.TryParse(parts[0], out idEmpleado)) return false;
                if (!long.TryParse(parts[1], out expiresAt)) return false;
                fingerprint = parts[2];
                var providedSignature = parts[3];

                var expectedSignature = ComputeHmac($"{parts[0]}|{parts[1]}|{parts[2]}");
                return CryptographicOperations.FixedTimeEquals(
                    Encoding.UTF8.GetBytes(providedSignature),
                    Encoding.UTF8.GetBytes(expectedSignature));
            }
            catch
            {
                return false;
            }
        }

        private static string Base64UrlEncode(string input)
        {
            return Convert.ToBase64String(Encoding.UTF8.GetBytes(input))
                .TrimEnd('=')
                .Replace('+', '-')
                .Replace('/', '_');
        }

        private static string Base64UrlDecode(string input)
        {
            var padded = input.Replace('-', '+').Replace('_', '/');
            switch (padded.Length % 4)
            {
                case 2: padded += "=="; break;
                case 3: padded += "="; break;
            }
            return Encoding.UTF8.GetString(Convert.FromBase64String(padded));
        }
    }
}
