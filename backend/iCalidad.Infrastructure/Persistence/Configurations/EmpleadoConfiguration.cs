using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using iCalidad.Domain.Entities;

namespace iCalidad.Infrastructure.Persistence.Configurations
{
    public class EmpleadoConfiguration : IEntityTypeConfiguration<Empleado>
    {
        public void Configure(EntityTypeBuilder<Empleado> builder)
        {
            builder.ToTable("Gen_TEmpleado");

            builder.HasKey(e => e.IdEmpleado);

            builder.Property(e => e.NombreEmpleado)
                .HasMaxLength(150)
                .IsRequired();

            builder.Property(e => e.Correo)
                .HasMaxLength(100);

            builder.Property(e => e.UserName)
                .HasMaxLength(50)
                .IsRequired();

            builder.Property(e => e.Password)
                .HasMaxLength(256)
                .IsRequired();

            builder.Property(e => e.ImageEmpleado)
                .HasMaxLength(256);

            builder.Property(e => e.IdEstatusEmpleado)
                .HasColumnName("IdEstatusEmpleado")
                .HasColumnType("bit")
                .IsRequired();
        }
    }
}
