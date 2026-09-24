namespace iCalidad.Application.DTOs
{
    public class DepartamentoDto
    {
        public int IdDepartamento { get; set; }
        public string ClaveDepartamento { get; set; } = string.Empty;
        public string NombreDepartamento { get; set; } = string.Empty;
        public int IdGerencia { get; set; }
        public string? NombreGerencia { get; set; }
        public bool IdEstatusDepartamento { get; set; }
        public string Estatus => IdEstatusDepartamento ? "Activo" : "Inactivo";
        public string BorrarDepartamento { get; set; } = string.Empty;
    }

    public class DepartamentoSimpleDto
    {
        public int IdDepartamento { get; set; }
        public string NombreDepartamento { get; set; } = string.Empty;
        public int IdGerencia { get; set; }
    }

    public class CreateDepartamentoRequest
    {
        public string ClaveDepartamento { get; set; } = string.Empty;
        public string NombreDepartamento { get; set; } = string.Empty;
        public int IdGerencia { get; set; }
    }

    public class UpdateDepartamentoRequest
    {
        public int IdDepartamento { get; set; }
        public string ClaveDepartamento { get; set; } = string.Empty;
        public string NombreDepartamento { get; set; } = string.Empty;
        public int IdGerencia { get; set; }
        public bool IdEstatusDepartamento { get; set; } = true;
    }

    public class DepartamentoResultDto
    {
        public int Resultado { get; set; }
        public string Mensaje { get; set; } = string.Empty;
    }
}
