using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using iCalidad.Domain.Entities;

namespace iCalidad.Infrastructure.Persistence.Configurations
{
    public class DepartamentoConfiguration : IEntityTypeConfiguration<Departamento>
    {
        public void Configure(EntityTypeBuilder<Departamento> builder)
        {
            builder.ToTable("Gen_TDepartamento");

            builder.HasKey(d => d.IdDepartamento);

            builder.Property(d => d.IdDepartamento)
                .HasColumnName("IdDepartamento");

            builder.Property(d => d.NombreDepartamento)
                .HasColumnName("NombreDepartamento")
                .HasMaxLength(150)
                .IsRequired();

            builder.Property(d => d.ClaveDepartamento)
                .HasColumnName("ClaveDepartamento")
                .HasMaxLength(40)
                .IsRequired();

            builder.Property(d => d.ClaveNombreDepartamento)
                .HasColumnName("ClaveNombreDepartamento")
                .HasMaxLength(200);

            builder.Property(d => d.IdGerencia)
                .HasColumnName("IdGerencia")
                .IsRequired();

            builder.Property(d => d.IdEstatusDepartamento)
                .HasColumnName("IdEstatusDepartamento")
                .IsRequired();

            builder.Property(d => d.FechaAlta)
                .HasColumnName("FechaAlta");

            builder.Property(d => d.IdEmpleadoAlta)
                .HasColumnName("IdEmpleadoAlta");

            builder.Property(d => d.FechaActualiza)
                .HasColumnName("FechaActualiza");

            builder.Property(d => d.IdEmpleadoActualiza)
                .HasColumnName("IdEmpleadoActualiza");

            builder.Property(d => d.FechaBorrado)
                .HasColumnName("FechaBorrado");

            builder.Property(d => d.IdEmpleadoBorrado)
                .HasColumnName("IdEmpleadoBorrado");

            builder.HasOne(d => d.Gerencia)
                .WithMany()
                .HasForeignKey(d => d.IdGerencia)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
