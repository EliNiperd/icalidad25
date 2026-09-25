using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using iCalidad.Domain.Entities;

namespace iCalidad.Infrastructure.Persistence.Configurations
{
    public class PuestoConfiguration : IEntityTypeConfiguration<Puesto>
    {
        public void Configure(EntityTypeBuilder<Puesto> builder)
        {
            builder.ToTable("Gen_TPuesto", tb => tb.UseSqlOutputClause(false));

            builder.HasKey(p => p.IdPuesto);

            builder.Property(p => p.IdPuesto)
                .HasColumnName("IdPuesto");

            builder.Property(p => p.NombrePuesto)
                .HasColumnName("NombrePuesto")
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(p => p.IdDepartamento)
                .HasColumnName("IdDepartamento");

            builder.Property(p => p.IdEstatusPuesto)
                .HasColumnName("IdEstatusPuesto")
                .IsRequired();

            builder.Property(p => p.FechaAlta)
                .HasColumnName("FechaAlta");

            builder.Property(p => p.IdEmpleadoAlta)
                .HasColumnName("IdEmpleadoAlta");

            builder.Property(p => p.FechaActualiza)
                .HasColumnName("FechaActualiza");

            builder.Property(p => p.IdEmpleadoActualiza)
                .HasColumnName("IdEmpleadoActualiza");

            builder.HasOne(p => p.Departamento)
                .WithMany()
                .HasForeignKey(p => p.IdDepartamento)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
