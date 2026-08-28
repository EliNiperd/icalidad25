using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using iCalidad.Infrastructure.Persistence;

namespace iCalidad.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            var dbProvider = configuration["DB_PROVIDER"] ?? "SqlServer";
            var connectionString = configuration["ConnectionStrings:DefaultConnection"];

            if (dbProvider.Equals("SqlServer", StringComparison.OrdinalIgnoreCase))
            {
                services.AddDbContext<ApplicationDbContext>(options =>
                    options.UseSqlServer(connectionString,
                        b => b.MigrationsAssembly("iCalidad.WebAPI")));
            }
            // Para el futuro soporte multi-base de datos:
            // else if (dbProvider.Equals("MySql", StringComparison.OrdinalIgnoreCase))
            // {
            //     services.AddDbContext<ApplicationDbContext>(options =>
            //         options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),
            //             b => b.MigrationsAssembly("iCalidad.WebAPI")));
            // }

            return services;
        }
    }
}
