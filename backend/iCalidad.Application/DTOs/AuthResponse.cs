namespace iCalidad.Application.DTOs
{
    public class AuthResponse
    {
        public int IdEmpleado { get; set; }
        public string NombreEmpleado { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string? Correo { get; set; }
        public string? ImageEmpleado { get; set; }
        public List<string> Roles { get; set; } = new();
        public string Token { get; set; } = string.Empty;
    }
}
