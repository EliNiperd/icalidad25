namespace iCalidad.Domain.Entities
{
    public class Gerencia
    {
        public int IdGerencia { get; set; }
        public string ClaveGerencia { get; set; } = string.Empty;
        public string NombreGerencia { get; set; } = string.Empty;
        public bool IdEstatusGerencia { get; set; } = true;

        // Auditoría
        public DateTime? FechaAlta { get; set; }
        public int? IdEmpleadoAlta { get; set; }
        public DateTime? FechaActualiza { get; set; }
        public int? IdEmpleadoActualiza { get; set; }
        public DateTime? FechaBorrado { get; set; }
        public int? IdEmpleadoBorra { get; set; }
    }
}
