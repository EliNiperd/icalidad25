using Microsoft.EntityFrameworkCore;
using iCalidad.Application.Common.Interfaces;
using iCalidad.Application.DTOs;

namespace iCalidad.Application.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IApplicationDbContext _context;
        private readonly ITokenService _tokenService;

        public AuthenticationService(IApplicationDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
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
    }
}
