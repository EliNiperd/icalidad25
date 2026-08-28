using System.Reflection;
using Microsoft.EntityFrameworkCore;
using iCalidad.Domain.Entities;

namespace iCalidad.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Empleado> Empleados => Set<Empleado>();
        public DbSet<Rol> Roles => Set<Rol>();
        public DbSet<EmpleadoRol> EmpleadosRoles => Set<EmpleadoRol>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Aplica dinámicamente todas las configuraciones del ensamblado de Infraestructura
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
    }
}
