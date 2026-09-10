using Microsoft.EntityFrameworkCore;
using iCalidad.Application.Common.Interfaces;
using iCalidad.Application.DTOs;

namespace iCalidad.Application.Services
{
    public class MenuService : IMenuService
    {
        private readonly IApplicationDbContext _context;

        public MenuService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<MenuItemDto>> GetMenuByEmployeeAsync(int employeeId)
        {
            // 1. Obtener los IDs de roles asignados al empleado
            var roleIds = await _context.EmpleadosRoles
                .Where(er => er.IdEmpleado == employeeId)
                .Select(er => er.IdRol)
                .ToListAsync();

            if (!roleIds.Any())
            {
                return new List<MenuItemDto>();
            }

            // 2. Consultar los menús activos (1 = Activo, 2 = Visible especial) para dichos roles
            var menus = await _context.Menus
                .Where(m => roleIds.Contains(m.IdRol) && (m.IdEstatusMenu == 1 || m.IdEstatusMenu == 2))
                .OrderBy(m => m.OrdenMenu)
                .ThenBy(m => m.IdMenu)
                .ToListAsync();

            // 3. Evitar duplicados si el empleado tiene múltiples roles con acceso al mismo menú
            var distinctMenus = menus
                .GroupBy(m => m.IdMenu)
                .Select(g => g.First())
                .OrderBy(m => m.OrdenMenu)
                .ThenBy(m => m.IdMenu)
                .Select(m => new MenuItemDto
                {
                    Id = m.IdMenu,
                    Nombre = m.NombreMenu,
                    Icono = m.Icono ?? string.Empty,
                    Ruta = m.Url ?? string.Empty,
                    IdPadre = m.IdMenuPadre ?? 0,
                    Orden = m.OrdenMenu
                })
                .ToList();

            return distinctMenus;
        }
    }
}
