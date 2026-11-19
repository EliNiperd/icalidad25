using iCalidad.Application.DTOs;

namespace iCalidad.Application.Common.Interfaces
{
    public interface IAuthenticationService
    {
        Task<AuthResponse?> AuthenticateAsync(LoginRequest request);
        Task<PasswordRecoveryResult> ForgotPasswordAsync(ForgotPasswordRequest request);
        Task<PasswordRecoveryResult> ResetPasswordAsync(ResetPasswordRequest request);
    }
}
