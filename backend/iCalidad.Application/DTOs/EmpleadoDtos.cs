using System;
using System.Collections.Generic;

namespace iCalidad.Application.DTOs
{
    public class PuestoAsignadoDto
    {
        public int IdPuesto { get; set; }
        public string NombrePuesto { get; set; } = string.Empty;
        public DateTime FechaAsignacion { get; set; }
    }

    public class RolAsignadoDto
    {
        public int IdRol { get; set; }
        public string NombreRol { get; set; } = string.Empty;
    }

    public class HistorialPuestoDto
    {
        public int IdHistorial { get; set; }
        public int IdEmpleado { get; set; }
        public int IdPuesto { get; set; }
        public string NombrePuesto { get; set; } = string.Empty;
        public string TipoAccion { get; set; } = string.Empty;
        public DateTime FechaAccion { get; set; }
        public string UsuarioAccion { get; set; } = string.Empty;
        public string NombreUsuario { get; set; } = string.Empty;
    }

    public class EmpleadoDto
    {
        public int IdEmpleado { get; set; }
        public string NombreEmpleado { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Correo { get; set; }
        public bool IdEstatusEmpleado { get; set; }
        public string Estatus => IdEstatusEmpleado ? "Activo" : "Inactivo";
        public DateTime? FechaAlta { get; set; }
        public List<PuestoAsignadoDto> Puestos { get; set; } = new();
        public List<RolAsignadoDto> Roles { get; set; } = new();
    }

    public class EmpleadoListItemDto
    {
        public int IdEmpleado { get; set; }
        public string NombreEmpleado { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string? Correo { get; set; }
        public bool IdEstatusEmpleado { get; set; }
        public string Estatus => IdEstatusEmpleado ? "Activo" : "Inactivo";
    }

    public class CreateEmpleadoRequest
    {
        public string NombreEmpleado { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Correo { get; set; }
        public List<int> IdPuestos { get; set; } = new();
        public List<int> IdRoles { get; set; } = new();
        public bool IdEstatusEmpleado { get; set; } = true;
    }

    public class UpdateEmpleadoRequest
    {
        public int IdEmpleado { get; set; }
        public string NombreEmpleado { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Correo { get; set; }
        public List<int> IdPuestos { get; set; } = new();
        public List<int> IdRoles { get; set; } = new();
        public bool IdEstatusEmpleado { get; set; } = true;
    }

    public class EmpleadoResultDto
    {
        public int Resultado { get; set; }
        public string Mensaje { get; set; } = string.Empty;
        public int? IdEmpleado { get; set; }
    }
}
