using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using iCalidad.Domain.Entities;

namespace iCalidad.Infrastructure.Persistence.Configurations
{
    public class RequisitoConfiguration : IEntityTypeConfiguration<Requisito>
    {
        public void Configure(EntityTypeBuilder<Requisito> builder)
        {
            builder.ToTable("Gen_TRequisito", tb => tb.UseSqlOutputClause(false));

            builder.HasKey(r => r.IdRequisito);

            builder.Property(r => r.IdRequisito)
                .HasColumnName("IdRequisito");

            builder.Property(r => r.IdNormativa)
                .HasColumnName("IdNormativa");

            builder.Property(r => r.ClaveRequisito)
                .HasColumnName("ClaveRequisito")
                .HasMaxLength(50);

            builder.Property(r => r.NombreRequisito)
                .HasColumnName("NombreRequisito")
                .HasMaxLength(500);

            builder.Property(r => r.ClaveNombreRequisito)
                .HasColumnName("ClaveNombreRequisito")
                .HasMaxLength(553)
                .ValueGeneratedOnAddOrUpdate();

            builder.Property(r => r.TextoRequisito)
                .HasColumnName("TextoRequisito");

            builder.Property(r => r.IdTipoRequisito)
                .HasColumnName("IdTipoRequisito");

            builder.Property(r => r.IdEstatusRequisito)
                .HasColumnName("IdEstatusRequisito");

            builder.Property(r => r.FechaBaja)
                .HasColumnName("FechaBaja");

            builder.Property(r => r.IdEmpleadoBaja)
                .HasColumnName("IdEmpleadoBaja");

            builder.Property(r => r.IdEmpleadoAlta)
                .HasColumnName("IdEmpleadoAlta");

            builder.Property(r => r.FechaAlta)
                .HasColumnName("FechaAlta");

            builder.Property(r => r.IdEmpleadoActualiza)
                .HasColumnName("IdEmpleadoActualiza");

            builder.Property(r => r.FechaActualiza)
                .HasColumnName("FechaActualiza");

            builder.HasOne(r => r.Normativa)
                .WithMany(n => n.Requisitos)
                .HasForeignKey(r => r.IdNormativa)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
