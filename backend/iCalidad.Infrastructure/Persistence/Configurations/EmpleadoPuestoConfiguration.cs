using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using iCalidad.Domain.Entities;

namespace iCalidad.Infrastructure.Persistence.Configurations
{
    public class EmpleadoPuestoConfiguration : IEntityTypeConfiguration<EmpleadoPuesto>
    {
        public void Configure(EntityTypeBuilder<EmpleadoPuesto> builder)
        {
            builder.ToTable("Gen_REmpleadoPuesto", tb => tb.UseSqlOutputClause(false));

            builder.HasKey(ep => new { ep.IdEmpleado, ep.IdPuesto });

            builder.HasOne(ep => ep.Empleado)
                .WithMany(e => e.EmpleadosPuestos)
                .HasForeignKey(ep => ep.IdEmpleado)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(ep => ep.Puesto)
                .WithMany(p => p.EmpleadosPuestos)
                .HasForeignKey(ep => ep.IdPuesto)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
