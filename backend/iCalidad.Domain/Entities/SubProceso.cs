namespace iCalidad.Domain.Entities
{
    public class SubProceso
    {
        public int IdSubProceso { get; set; }
        public int IdProceso { get; set; }
        public string? ClaveSubProceso { get; set; }
        public string? DescripcionSubProceso { get; set; }

        // Auditoría
        public int? IdEmpleadoAlta { get; set; }
        public DateTime? FechaAlta { get; set; }
        public int? IdEmpleadoActualiza { get; set; }
        public DateTime? FechaActualiza { get; set; }

        // Navegación
        public Proceso? Proceso { get; set; }
    }
}
