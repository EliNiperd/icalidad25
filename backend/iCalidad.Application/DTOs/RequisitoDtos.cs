namespace iCalidad.Application.DTOs
{
    public class RequisitoDto
    {
        public int IdRequisito { get; set; }
        public int IdNormativa { get; set; }
        public string ClaveNormativa { get; set; } = string.Empty;
        public string NombreNormativa { get; set; } = string.Empty;
        public string ClaveRequisito { get; set; } = string.Empty;
        public string NombreRequisito { get; set; } = string.Empty;
        public string? ClaveNombreRequisito { get; set; }
        public string? TextoRequisito { get; set; }
        public int? IdTipoRequisito { get; set; }
        public bool IdEstatusRequisito { get; set; }
        public string Estatus => IdEstatusRequisito ? "Activo" : "Inactivo";
    }

    public class CreateRequisitoRequest
    {
        public int IdNormativa { get; set; }
        public string ClaveRequisito { get; set; } = string.Empty;
        public string NombreRequisito { get; set; } = string.Empty;
        public string? TextoRequisito { get; set; }
        public int? IdTipoRequisito { get; set; }
    }

    public class UpdateRequisitoRequest
    {
        public int IdRequisito { get; set; }
        public int IdNormativa { get; set; }
        public string ClaveRequisito { get; set; } = string.Empty;
        public string NombreRequisito { get; set; } = string.Empty;
        public string? TextoRequisito { get; set; }
        public int? IdTipoRequisito { get; set; }
        public bool IdEstatusRequisito { get; set; } = true;
    }

    public class RequisitoResultDto
    {
        public int Resultado { get; set; }
        public string Mensaje { get; set; } = string.Empty;
    }
}
