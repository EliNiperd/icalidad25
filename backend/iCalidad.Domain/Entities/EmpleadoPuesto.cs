namespace iCalidad.Domain.Entities
{
    public class EmpleadoPuesto
    {
        public int IdEmpleado { get; set; }
        public Empleado Empleado { get; set; } = null!;

        public int IdPuesto { get; set; }
        public Puesto Puesto { get; set; } = null!;
    }
}
