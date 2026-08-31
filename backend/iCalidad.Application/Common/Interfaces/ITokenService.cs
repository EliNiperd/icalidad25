using iCalidad.Domain.Entities;

namespace iCalidad.Application.Common.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(Empleado empleado, IEnumerable<string> roles);
    }
}
