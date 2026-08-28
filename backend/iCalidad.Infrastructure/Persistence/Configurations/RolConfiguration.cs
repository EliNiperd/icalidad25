using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using iCalidad.Domain.Entities;

namespace iCalidad.Infrastructure.Persistence.Configurations
{
    public class RolConfiguration : IEntityTypeConfiguration<Rol>
    {
        public void Configure(EntityTypeBuilder<Rol> builder)
        {
            builder.ToTable("Gen_TRol");

            builder.HasKey(r => r.IdRol);

            builder.Property(r => r.NombreRol)
                .HasMaxLength(50)
                .IsRequired();
        }
    }
}
