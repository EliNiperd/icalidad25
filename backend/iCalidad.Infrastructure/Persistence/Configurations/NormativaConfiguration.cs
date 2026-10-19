using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using iCalidad.Domain.Entities;

namespace iCalidad.Infrastructure.Persistence.Configurations
{
    public class NormativaConfiguration : IEntityTypeConfiguration<Normativa>
    {
        public void Configure(EntityTypeBuilder<Normativa> builder)
        {
            builder.ToTable("Gen_TNormativa", tb => tb.UseSqlOutputClause(false));

            builder.HasKey(n => n.IdNormativa);

            builder.Property(n => n.IdNormativa)
                .HasColumnName("IdNormativa");

            builder.Property(n => n.ClaveNormativa)
                .HasColumnName("ClaveNormativa")
                .HasMaxLength(20);

            builder.Property(n => n.NombreNormativa)
                .HasColumnName("NombreNormativa")
                .HasMaxLength(100);

            builder.Property(n => n.ClaveNombreNormativa)
                .HasColumnName("ClaveNombreNormativa")
                .HasMaxLength(123)
                .ValueGeneratedOnAddOrUpdate();

            builder.Property(n => n.IdEstatusNormativa)
                .HasColumnName("IdEstatusNormativa");

            builder.Property(n => n.IdEmpleadoAlta)
                .HasColumnName("IdEmpleadoAlta");

            builder.Property(n => n.FechaAlta)
                .HasColumnName("FechaAlta");

            builder.Property(n => n.IdEmpleadoActualiza)
                .HasColumnName("IdEmpleadoActualiza");

            builder.Property(n => n.FechaActualiza)
                .HasColumnName("FechaActualiza");

            builder.HasMany(n => n.Requisitos)
                .WithOne(r => r.Normativa)
                .HasForeignKey(r => r.IdNormativa)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
