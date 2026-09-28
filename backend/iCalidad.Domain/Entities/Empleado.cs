using System;

namespace iCalidad.Domain.Entities
{
    public class Empleado
    {
        public int IdEmpleado { get; set; }
        public string NombreEmpleado { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Correo { get; set; }
        public bool IdEstatusEmpleado { get; set; } = true;
        public string? ExtensionFirma { get; set; }
        public string? ImageEmpleado { get; set; }

        // Auditoría
        public DateTime? FechaAlta { get; set; }
        public int? IdEmpleadoAlta { get; set; }
        public DateTime? FechaActualiza { get; set; }
        public int? IdEmpleadoActualiza { get; set; }

        // Navegación
        public ICollection<EmpleadoRol> EmpleadosRoles { get; set; } = new List<EmpleadoRol>();
        public ICollection<EmpleadoPuesto> EmpleadosPuestos { get; set; } = new List<EmpleadoPuesto>();
    }
}
