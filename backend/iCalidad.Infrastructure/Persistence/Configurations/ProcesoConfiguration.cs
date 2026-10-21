using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using iCalidad.Domain.Entities;

namespace iCalidad.Infrastructure.Persistence.Configurations
{
    public class ProcesoConfiguration : IEntityTypeConfiguration<Proceso>
    {
        public void Configure(EntityTypeBuilder<Proceso> builder)
        {
            builder.ToTable("Gen_TProceso", tb => tb.UseSqlOutputClause(false));

            builder.HasKey(p => p.IdProceso);

            builder.Property(p => p.IdProceso)
                .HasColumnName("IdProceso");

            builder.Property(p => p.ClaveProceso)
                .HasColumnName("ClaveProceso")
                .HasMaxLength(20);

            builder.Property(p => p.NombreProceso)
                .HasColumnName("NombreProceso")
                .HasMaxLength(100);

            builder.Property(p => p.ClaveNombreProceso)
                .HasColumnName("ClaveNombreProceso")
                .HasMaxLength(123)
                .ValueGeneratedOnAddOrUpdate();

            builder.Property(p => p.ResponsableProceso)
                .HasColumnName("ResponsableProceso")
                .HasMaxLength(50);

            builder.Property(p => p.IdEstatusProceso)
                .HasColumnName("IdEstatusProceso");

            builder.Property(p => p.IdEmpleadoResponsable)
                .HasColumnName("IdEmpleadoResponsable");

            builder.Property(p => p.IdEmpleadoAlta)
                .HasColumnName("IdEmpleadoAlta");

            builder.Property(p => p.FechaAlta)
                .HasColumnName("FechaAlta");

            builder.Property(p => p.IdEmpleadoActualiza)
                .HasColumnName("IdEmpleadoActualiza");

            builder.Property(p => p.FechaActualiza)
                .HasColumnName("FechaActualiza");

            builder.HasOne(p => p.EmpleadoResponsable)
                .WithMany()
                .HasForeignKey(p => p.IdEmpleadoResponsable)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(p => p.SubProcesos)
                .WithOne(sp => sp.Proceso)
                .HasForeignKey(sp => sp.IdProceso)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
