using Microsoft.Extensions.DependencyInjection;
using iCalidad.Application.Common.Interfaces;
using iCalidad.Application.Services;

namespace iCalidad.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<IAuthenticationService, AuthenticationService>();
            return services;
        }
    }
}
