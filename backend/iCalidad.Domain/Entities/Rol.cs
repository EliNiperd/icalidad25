namespace iCalidad.Domain.Entities
{
    public class Rol
    {
        public int IdRol { get; set; }
        public string NombreRol { get; set; } = string.Empty;
        public bool IdEstatusRol { get; set; } = true;

        // Propiedad de navegación para la relación de muchos a muchos
        public ICollection<EmpleadoRol> EmpleadosRoles { get; set; } = new List<EmpleadoRol>();
    }
}
