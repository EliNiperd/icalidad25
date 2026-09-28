using System.Collections.Generic;
using System.Threading.Tasks;
using iCalidad.Application.DTOs;

namespace iCalidad.Application.Common.Interfaces
{
    public interface IEmpleadoService
    {
        Task<PagedResult<EmpleadoDto>> GetPagedAsync(
            string? searchQuery,
            int pageNumber,
            int pageSize,
            string? sortBy,
            string? sortOrder);

        Task<List<EmpleadoListItemDto>> GetActiveListAsync();

        Task<EmpleadoDto?> GetByIdAsync(int id);

        Task<List<PuestoAsignadoDto>> GetPuestosByEmpleadoAsync(int idEmpleado);

        Task<List<RolAsignadoDto>> GetRolesByEmpleadoAsync(int idEmpleado);

        Task<EmpleadoResultDto> CreateAsync(CreateEmpleadoRequest request, int userId);

        Task<EmpleadoResultDto> UpdateAsync(int id, UpdateEmpleadoRequest request, int userId);

        Task<EmpleadoResultDto> DeleteAsync(int id, int userId);
    }
}
