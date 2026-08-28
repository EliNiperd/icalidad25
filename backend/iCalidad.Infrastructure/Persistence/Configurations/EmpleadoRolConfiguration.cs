using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using iCalidad.Domain.Entities;

namespace iCalidad.Infrastructure.Persistence.Configurations
{
    public class EmpleadoRolConfiguration : IEntityTypeConfiguration<EmpleadoRol>
    {
        public void Configure(EntityTypeBuilder<EmpleadoRol> builder)
        {
            builder.ToTable("Gen_REmpleadoRol");

            builder.HasKey(er => new { er.IdEmpleado, er.IdRol });

            builder.HasOne(er => er.Empleado)
                .WithMany(e => e.EmpleadosRoles)
                .HasForeignKey(er => er.IdEmpleado)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(er => er.Rol)
                .WithMany(r => r.EmpleadosRoles)
                .HasForeignKey(er => er.IdRol)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
