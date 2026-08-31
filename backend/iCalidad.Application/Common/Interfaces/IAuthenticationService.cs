using iCalidad.Application.DTOs;

namespace iCalidad.Application.Common.Interfaces
{
    public interface IAuthenticationService
    {
        Task<AuthResponse?> AuthenticateAsync(LoginRequest request);
    }
}
