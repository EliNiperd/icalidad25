using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using iCalidad.Domain.Entities;

namespace iCalidad.Infrastructure.Persistence.Configurations
{
    public class GerenciaConfiguration : IEntityTypeConfiguration<Gerencia>
    {
        public void Configure(EntityTypeBuilder<Gerencia> builder)
        {
            builder.ToTable("Gen_TGerencia");

            builder.HasKey(g => g.IdGerencia);

            builder.Property(g => g.IdGerencia)
                .HasColumnName("IdGerencia");

            builder.Property(g => g.ClaveGerencia)
                .HasColumnName("ClaveGerencia")
                .HasMaxLength(40)
                .IsRequired();

            builder.Property(g => g.NombreGerencia)
                .HasColumnName("NombreGerencia")
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(g => g.IdEstatusGerencia)
                .HasColumnName("IdEstatusGerencia")
                .IsRequired();

            builder.Property(g => g.FechaAlta)
                .HasColumnName("FechaAlta");

            builder.Property(g => g.IdEmpleadoAlta)
                .HasColumnName("IdEmpleadoAlta");

            builder.Property(g => g.FechaActualiza)
                .HasColumnName("FechaActualiza");

            builder.Property(g => g.IdEmpleadoActualiza)
                .HasColumnName("IdEmpleadoActualiza");

            builder.Property(g => g.FechaBorrado)
                .HasColumnName("FechaBorrado");

            builder.Property(g => g.IdEmpleadoBorra)
                .HasColumnName("IdEmpleadoBorra");
        }
    }
}
