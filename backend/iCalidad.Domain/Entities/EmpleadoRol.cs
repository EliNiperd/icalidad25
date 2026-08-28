namespace iCalidad.Domain.Entities
{
    public class EmpleadoRol
    {
        public int IdEmpleado { get; set; }
        public Empleado Empleado { get; set; } = null!;

        public int IdRol { get; set; }
        public Rol Rol { get; set; } = null!;
    }
}
