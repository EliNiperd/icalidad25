namespace iCalidad.Domain.Entities
{
    public class Departamento
    {
        public int IdDepartamento { get; set; }
        public string NombreDepartamento { get; set; } = string.Empty;
        public string ClaveDepartamento { get; set; } = string.Empty;
        public string? ClaveNombreDepartamento { get; set; }
        public int IdGerencia { get; set; }
        public bool IdEstatusDepartamento { get; set; } = true;

        // Auditoría
        public DateTime? FechaAlta { get; set; }
        public int? IdEmpleadoAlta { get; set; }
        public DateTime? FechaActualiza { get; set; }
        public int? IdEmpleadoActualiza { get; set; }
        public DateTime? FechaBorrado { get; set; }
        public int? IdEmpleadoBorrado { get; set; }

        // Navegación
        public Gerencia? Gerencia { get; set; }
    }
}
