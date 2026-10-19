namespace iCalidad.Domain.Entities
{
    public class Normativa
    {
        public int IdNormativa { get; set; }
        public string? ClaveNormativa { get; set; }
        public string? NombreNormativa { get; set; }
        public string? ClaveNombreNormativa { get; set; }
        public bool IdEstatusNormativa { get; set; } = true;

        // Auditoría
        public int? IdEmpleadoAlta { get; set; }
        public DateTime? FechaAlta { get; set; }
        public int? IdEmpleadoActualiza { get; set; }
        public DateTime? FechaActualiza { get; set; }

        // Navegación
        public ICollection<Requisito> Requisitos { get; set; } = new List<Requisito>();
    }
}
