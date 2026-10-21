using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using iCalidad.Domain.Entities;

namespace iCalidad.Infrastructure.Persistence.Configurations
{
    public class SubProcesoConfiguration : IEntityTypeConfiguration<SubProceso>
    {
        public void Configure(EntityTypeBuilder<SubProceso> builder)
        {
            builder.ToTable("Gen_RProcesoSubProceso", tb => tb.UseSqlOutputClause(false));

            builder.HasKey(sp => sp.IdSubProceso);

            builder.Property(sp => sp.IdSubProceso)
                .HasColumnName("IdSubProceso");

            builder.Property(sp => sp.IdProceso)
                .HasColumnName("IdProceso")
                .IsRequired();

            builder.Property(sp => sp.ClaveSubProceso)
                .HasColumnName("ClaveSubProceso")
                .HasMaxLength(20);

            builder.Property(sp => sp.DescripcionSubProceso)
                .HasColumnName("DescripcionSubProceso")
                .HasMaxLength(100);

            builder.Property(sp => sp.IdEmpleadoAlta)
                .HasColumnName("IdEmpleadoAlta");

            builder.Property(sp => sp.FechaAlta)
                .HasColumnName("FechaAlta");

            builder.Property(sp => sp.IdEmpleadoActualiza)
                .HasColumnName("IdEmpleadoActualiza");

            builder.Property(sp => sp.FechaActualiza)
                .HasColumnName("FechaActualiza");

            builder.HasOne(sp => sp.Proceso)
                .WithMany(p => p.SubProcesos)
                .HasForeignKey(sp => sp.IdProceso)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
