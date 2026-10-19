namespace iCalidad.Application.DTOs
{
    public class NormativaDto
    {
        public int IdNormativa { get; set; }
        public string ClaveNormativa { get; set; } = string.Empty;
        public string NombreNormativa { get; set; } = string.Empty;
        public string? ClaveNombreNormativa { get; set; }
        public bool IdEstatusNormativa { get; set; }
        public string Estatus => IdEstatusNormativa ? "Activo" : "Inactivo";
    }

    public class NormativaSimpleDto
    {
        public int IdNormativa { get; set; }
        public string ClaveNormativa { get; set; } = string.Empty;
        public string NombreNormativa { get; set; } = string.Empty;
        public bool IdEstatusNormativa { get; set; }
    }

    public class CreateNormativaRequest
    {
        public string ClaveNormativa { get; set; } = string.Empty;
        public string NombreNormativa { get; set; } = string.Empty;
    }

    public class UpdateNormativaRequest
    {
        public int IdNormativa { get; set; }
        public string ClaveNormativa { get; set; } = string.Empty;
        public string NombreNormativa { get; set; } = string.Empty;
        public bool IdEstatusNormativa { get; set; } = true;
    }

    public class NormativaResultDto
    {
        public int Resultado { get; set; }
        public string Mensaje { get; set; } = string.Empty;
    }
}
