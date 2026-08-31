using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using iCalidad.Application.Common.Interfaces;
using iCalidad.Domain.Entities;

namespace iCalidad.Infrastructure.Security
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _configuration;

        public TokenService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(Empleado empleado, IEnumerable<string> roles)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            
            // Cargar clave secreta desde la configuración (.env o appsettings)
            var secretKey = _configuration["JWT_SECRET"] 
                ?? "ClaveSuperSecretaDeiCalidad2026!DebeTenerAlMenos256BitsDeLargoParaSeguridad"; 
            
            var key = Encoding.UTF8.GetBytes(secretKey);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, empleado.IdEmpleado.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, empleado.UserName),
                new Claim(ClaimTypes.Name, empleado.NombreEmpleado),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            if (!string.IsNullOrEmpty(empleado.Correo))
            {
                claims.Add(new Claim(JwtRegisteredClaimNames.Email, empleado.Correo));
            }

            // Inyectar los roles como claims de autorización
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7), // Token válido por 7 días
                Issuer = _configuration["JWT_ISSUER"] ?? "iCalidadAPI",
                Audience = _configuration["JWT_AUDIENCE"] ?? "iCalidadClients",
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
