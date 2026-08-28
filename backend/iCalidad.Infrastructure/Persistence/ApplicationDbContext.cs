using Microsoft.EntityFrameworkCore;

namespace iCalidad.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Aquí se configurarán las relaciones y el mapeo de tablas (Fluent API)
        }
    }
}
