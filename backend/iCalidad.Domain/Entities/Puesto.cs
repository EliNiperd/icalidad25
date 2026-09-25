namespace iCalidad.Domain.Entities
{
    public class Puesto
    {
        public int IdPuesto { get; set; }
        public string? NombrePuesto { get; set; }
        public int? IdDepartamento { get; set; }
        public bool IdEstatusPuesto { get; set; } = true;

        // Auditoría
        public DateTime? FechaAlta { get; set; }
        public int? IdEmpleadoAlta { get; set; }
        public DateTime? FechaActualiza { get; set; }
        public int? IdEmpleadoActualiza { get; set; }

        // Navegación
        public Departamento? Departamento { get; set; }
    }
}
