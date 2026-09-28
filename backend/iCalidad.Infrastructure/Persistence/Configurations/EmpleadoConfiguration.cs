using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using iCalidad.Domain.Entities;

namespace iCalidad.Infrastructure.Persistence.Configurations
{
    public class EmpleadoConfiguration : IEntityTypeConfiguration<Empleado>
    {
        public void Configure(EntityTypeBuilder<Empleado> builder)
        {
            builder.ToTable("Gen_TEmpleado", tb => tb.UseSqlOutputClause(false));

            builder.HasKey(e => e.IdEmpleado);

            builder.Property(e => e.NombreEmpleado)
                .HasMaxLength(200);

            builder.Property(e => e.UserName)
                .HasMaxLength(20);

            builder.Property(e => e.Password)
                .HasMaxLength(20);

            builder.Property(e => e.Correo)
                .HasMaxLength(100);

            builder.Property(e => e.IdEstatusEmpleado)
                .HasColumnName("IdEstatusEmpleado")
                .HasColumnType("bit")
                .IsRequired();

            builder.Property(e => e.ExtensionFirma)
                .HasMaxLength(5);

            builder.Property(e => e.ImageEmpleado)
                .HasMaxLength(500);

            // Auditoría
            builder.Property(e => e.FechaAlta);
            builder.Property(e => e.IdEmpleadoAlta);
            builder.Property(e => e.FechaActualiza);
            builder.Property(e => e.IdEmpleadoActualiza);
        }
    }
}
