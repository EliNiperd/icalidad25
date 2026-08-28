namespace iCalidad.Domain.Entities
{
    public class Empleado
    {
        public int IdEmpleado { get; set; }
        public string NombreEmpleado { get; set; } = string.Empty;
        public string? Correo { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? ImageEmpleado { get; set; }
        public bool IdEstatusEmpleado { get; set; } // Representa la columna BIT en SQL Server

        // Propiedad de navegación para la relación de muchos a muchos
        public ICollection<EmpleadoRol> EmpleadosRoles { get; set; } = new List<EmpleadoRol>();
    }
}
