namespace iCalidad.Domain.Entities
{
    public class Requisito
    {
        public int IdRequisito { get; set; }
        public int? IdNormativa { get; set; }
        public string? ClaveRequisito { get; set; }
        public string? NombreRequisito { get; set; }
        public string? ClaveNombreRequisito { get; set; }
        public string? TextoRequisito { get; set; }
        public int? IdTipoRequisito { get; set; }
        public bool IdEstatusRequisito { get; set; } = true;

        // Auditoría / Bajas
        public DateTime? FechaBaja { get; set; }
        public int? IdEmpleadoBaja { get; set; }
        public int? IdEmpleadoAlta { get; set; }
        public DateTime? FechaAlta { get; set; }
        public int? IdEmpleadoActualiza { get; set; }
        public DateTime? FechaActualiza { get; set; }

        // Navegación
        public Normativa? Normativa { get; set; }
    }
}
