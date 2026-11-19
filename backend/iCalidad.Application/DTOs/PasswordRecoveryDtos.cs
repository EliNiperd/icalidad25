namespace iCalidad.Application.DTOs
{
    public class ForgotPasswordRequest
    {
        public string Identifier { get; set; } = string.Empty;
        public string? ResetBaseUrl { get; set; }
    }

    public class ResetPasswordRequest
    {
        public string Token { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }

    public class PasswordRecoveryResult
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
