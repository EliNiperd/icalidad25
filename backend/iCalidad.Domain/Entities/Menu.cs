namespace iCalidad.Domain.Entities
{
    public class Menu
    {
        public int IdMenu { get; set; }
        public string NombreMenu { get; set; } = string.Empty;
        public string? Icono { get; set; }
        public string? Url { get; set; }
        public int? IdMenuPadre { get; set; }
        public int OrdenMenu { get; set; }
        public int IdRol { get; set; }
        public int IdEstatusMenu { get; set; }

        // Propiedad de navegación hacia el Rol
        public Rol? Rol { get; set; }
    }
}
