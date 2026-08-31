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
                return null; // El controlador se encargará de mapear esto a "Credenciales inválidas"
            }

            // 2. Validar estatus activo
            if (!empleado.IdEstatusEmpleado)
            {
                return null;
            }

            // 3. Validar contraseña (compatible con el texto plano actual en la BD de iCalidad)
            if (empleado.Password != request.Password)
            {
                return null;
            }

            // 4. Obtener los nombres de roles asociados al empleado
            var roles = await _context.EmpleadosRoles
                .Where(er => er.IdEmpleado == empleado.IdEmpleado)
                .Select(er => er.Rol.NombreRol)
                .ToListAsync();

            // 5. Generar token JWT firmado
            var token = _tokenService.GenerateToken(empleado, roles);

            return new AuthResponse
            {
                IdEmpleado = empleado.IdEmpleado,
                NombreEmpleado = empleado.NombreEmpleado,
                UserName = empleado.UserName,
                Correo = empleado.Correo, // Retorna null de forma segura si no tiene
                ImageEmpleado = empleado.ImageEmpleado, // Retorna null de forma segura si no tiene
                Roles = roles,
                Token = token
            };
        }
    }
}
