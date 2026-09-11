namespace iCalidad.Application.DTOs
{
    public class PagedResult<T>
    {
        public List<T> Items { get; set; } = new();
        public int TotalRecords { get; set; }
        public int TotalPages { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }

    public class GerenciaDto
    {
        public int IdGerencia { get; set; }
        public string ClaveGerencia { get; set; } = string.Empty;
        public string NombreGerencia { get; set; } = string.Empty;
        public bool IdEstatusGerencia { get; set; }
        public string Estatus => IdEstatusGerencia ? "Activo" : "Inactivo";
        public string BorrarGerencia { get; set; } = string.Empty;
    }

    public class GerenciaSimpleDto
    {
        public int IdGerencia { get; set; }
        public string NombreGerencia { get; set; } = string.Empty;
    }

    public class CreateGerenciaRequest
    {
        public string ClaveGerencia { get; set; } = string.Empty;
        public string NombreGerencia { get; set; } = string.Empty;
    }

    public class UpdateGerenciaRequest
    {
        public int IdGerencia { get; set; }
        public string ClaveGerencia { get; set; } = string.Empty;
        public string NombreGerencia { get; set; } = string.Empty;
        public bool IdEstatusGerencia { get; set; } = true;
    }

    public class GerenciaResultDto
    {
        public int Resultado { get; set; }
        public string Mensaje { get; set; } = string.Empty;
    }
}
