using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using iCalidad.Domain.Entities;

namespace iCalidad.Infrastructure.Persistence.Configurations
{
    public class MenuConfiguration : IEntityTypeConfiguration<Menu>
    {
        public void Configure(EntityTypeBuilder<Menu> builder)
        {
            builder.ToTable("Gen_TMenu");

            builder.HasKey(m => m.IdMenu);

            builder.Property(m => m.IdMenu)
                .HasColumnName("IdMenu");

            builder.Property(m => m.NombreMenu)
                .HasColumnName("Menu")
                .HasMaxLength(150)
                .IsRequired();

            builder.Property(m => m.Icono)
                .HasColumnName("Icono")
                .HasMaxLength(50);

            builder.Property(m => m.Url)
                .HasColumnName("URL")
                .HasMaxLength(256);

            builder.Property(m => m.IdMenuPadre)
                .HasColumnName("IdMenuPadre");

            builder.Property(m => m.OrdenMenu)
                .HasColumnName("OrdenMenu")
                .IsRequired();

            builder.Property(m => m.IdRol)
                .HasColumnName("IdRol")
                .IsRequired();

            builder.Property(m => m.IdEstatusMenu)
                .HasColumnName("IdEstatusMenu")
                .IsRequired();

            builder.HasOne(m => m.Rol)
                .WithMany()
                .HasForeignKey(m => m.IdRol)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
