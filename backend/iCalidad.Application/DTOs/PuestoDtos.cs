namespace iCalidad.Application.DTOs
{
    public class PuestoDto
    {
        public int IdPuesto { get; set; }
        public string NombrePuesto { get; set; } = string.Empty;
        public int IdDepartamento { get; set; }
        public string NombreDepartamento { get; set; } = string.Empty;
        public bool IdEstatusPuesto { get; set; }
        public string Estatus => IdEstatusPuesto ? "Activo" : "Inactivo";
    }

    public class PuestoSimpleDto
    {
        public int IdPuesto { get; set; }
        public string NombrePuesto { get; set; } = string.Empty;
        public int IdDepartamento { get; set; }
        public string NombreDepartamento { get; set; } = string.Empty;
        public bool IdEstatusPuesto { get; set; }
        public string Estatus => IdEstatusPuesto ? "Activo" : "Inactivo";
    }

    public class CreatePuestoRequest
    {
        public string NombrePuesto { get; set; } = string.Empty;
        public int IdDepartamento { get; set; }
    }

    public class UpdatePuestoRequest
    {
        public int IdPuesto { get; set; }
        public string NombrePuesto { get; set; } = string.Empty;
        public int IdDepartamento { get; set; }
        public bool IdEstatusPuesto { get; set; } = true;
    }

    public class PuestoResultDto
    {
        public int Resultado { get; set; }
        public string Mensaje { get; set; } = string.Empty;
    }
}
