using iCalidad.Application.DTOs;

namespace iCalidad.Application.Common.Interfaces
{
    public interface IGerenciaService
    {
        Task<PagedResult<GerenciaDto>> GetPagedAsync(
            string? searchQuery,
            int pageNumber,
            int pageSize,
            string? sortBy,
            string? sortOrder);

        Task<List<GerenciaSimpleDto>> GetActiveListAsync();

        Task<GerenciaDto?> GetByIdAsync(int id);

        Task<GerenciaResultDto> CreateAsync(CreateGerenciaRequest request, int userId);

        Task<GerenciaResultDto> UpdateAsync(int id, UpdateGerenciaRequest request, int userId);

        Task<GerenciaResultDto> DeleteAsync(int id, int userId);
    }
}
