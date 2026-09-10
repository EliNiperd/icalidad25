namespace iCalidad.Application.DTOs
{
    public class MenuItemDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Icono { get; set; } = string.Empty;
        public string Ruta { get; set; } = string.Empty;
        public int IdPadre { get; set; }
        public int Orden { get; set; }
    }
}
