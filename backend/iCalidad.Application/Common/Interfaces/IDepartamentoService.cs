using iCalidad.Application.DTOs;

namespace iCalidad.Application.Common.Interfaces
{
    public interface IDepartamentoService
    {
        Task<PagedResult<DepartamentoDto>> GetPagedAsync(
            string? searchQuery,
            int pageNumber,
            int pageSize,
            string? sortBy,
            string? sortOrder);

        Task<List<DepartamentoSimpleDto>> GetActiveListAsync(int? idGerencia = null);

        Task<DepartamentoDto?> GetByIdAsync(int id);

        Task<DepartamentoResultDto> CreateAsync(CreateDepartamentoRequest request, int userId);

        Task<DepartamentoResultDto> UpdateAsync(int id, UpdateDepartamentoRequest request, int userId);

        Task<DepartamentoResultDto> DeleteAsync(int id, int userId);
    }
}
