namespace iCalidad.Domain.Entities
{
    public class Proceso
    {
        public int IdProceso { get; set; }
        public string? ClaveProceso { get; set; }
        public string? NombreProceso { get; set; }
        public string? ClaveNombreProceso { get; set; }
        public string? ResponsableProceso { get; set; }
        public bool IdEstatusProceso { get; set; } = true;
        public int? IdEmpleadoResponsable { get; set; }

        // Auditoría
        public int? IdEmpleadoAlta { get; set; }
        public DateTime? FechaAlta { get; set; }
        public int? IdEmpleadoActualiza { get; set; }
        public DateTime? FechaActualiza { get; set; }

        // Navegación
        public Empleado? EmpleadoResponsable { get; set; }
        public ICollection<SubProceso> SubProcesos { get; set; } = new List<SubProceso>();
    }
}
