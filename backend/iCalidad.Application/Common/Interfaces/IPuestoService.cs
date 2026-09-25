using iCalidad.Application.DTOs;

namespace iCalidad.Application.Common.Interfaces
{
    public interface IPuestoService
    {
        Task<PagedResult<PuestoDto>> GetPagedAsync(
            string? searchQuery,
            int pageNumber,
            int pageSize,
            string? sortBy,
            string? sortOrder);

        Task<List<PuestoSimpleDto>> GetActiveListAsync(int? idDepartamento = null);

        Task<PuestoDto?> GetByIdAsync(int id);

        Task<PuestoResultDto> CreateAsync(CreatePuestoRequest request, int userId);

        Task<PuestoResultDto> UpdateAsync(int id, UpdatePuestoRequest request, int userId);

        Task<PuestoResultDto> DeleteAsync(int id, int userId);
    }
}
