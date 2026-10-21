namespace iCalidad.Application.DTOs
{
    public class ProcesoDto
    {
        public int IdProceso { get; set; }
        public string ClaveProceso { get; set; } = string.Empty;
        public string NombreProceso { get; set; } = string.Empty;
        public string? ClaveNombreProceso { get; set; }
        public string? ResponsableProceso { get; set; }
        public bool IdEstatusProceso { get; set; }
        public string Estatus => IdEstatusProceso ? "Activo" : "Inactivo";
        public int? IdEmpleadoResponsable { get; set; }
        public string? NombreEmpleadoResponsable { get; set; }
    }

    public class ProcesoSimpleDto
    {
        public int IdProceso { get; set; }
        public string ClaveProceso { get; set; } = string.Empty;
        public string NombreProceso { get; set; } = string.Empty;
        public bool IdEstatusProceso { get; set; }
    }

    public class CreateProcesoRequest
    {
        public string ClaveProceso { get; set; } = string.Empty;
        public string NombreProceso { get; set; } = string.Empty;
        public int? IdEmpleadoResponsable { get; set; }
    }

    public class UpdateProcesoRequest
    {
        public int IdProceso { get; set; }
        public string ClaveProceso { get; set; } = string.Empty;
        public string NombreProceso { get; set; } = string.Empty;
        public bool IdEstatusProceso { get; set; } = true;
        public int? IdEmpleadoResponsable { get; set; }
    }

    public class ProcesoResultDto
    {
        public int Resultado { get; set; }
        public string Mensaje { get; set; } = string.Empty;
    }

    public class SubProcesoDto
    {
        public int IdSubProceso { get; set; }
        public int IdProceso { get; set; }
        public string ClaveSubProceso { get; set; } = string.Empty;
        public string DescripcionSubProceso { get; set; } = string.Empty;
    }

    public class CreateSubProcesoRequest
    {
        public int IdProceso { get; set; }
        public string ClaveSubProceso { get; set; } = string.Empty;
        public string DescripcionSubProceso { get; set; } = string.Empty;
    }

    public class UpdateSubProcesoRequest
    {
        public int IdSubProceso { get; set; }
        public int IdProceso { get; set; }
        public string ClaveSubProceso { get; set; } = string.Empty;
        public string DescripcionSubProceso { get; set; } = string.Empty;
    }

    public class SubProcesoResultDto
    {
        public int Resultado { get; set; }
        public string Mensaje { get; set; } = string.Empty;
    }
}
