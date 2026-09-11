using Microsoft.EntityFrameworkCore;
using iCalidad.Domain.Entities;

namespace iCalidad.Application.Common.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<Empleado> Empleados { get; }
        DbSet<Rol> Roles { get; }
        DbSet<EmpleadoRol> EmpleadosRoles { get; }
        DbSet<Menu> Menus { get; }
        DbSet<Gerencia> Gerencias { get; }
        DbSet<Departamento> Departamentos { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
