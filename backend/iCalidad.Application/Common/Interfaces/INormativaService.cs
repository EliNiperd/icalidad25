using iCalidad.Application.DTOs;

namespace iCalidad.Application.Common.Interfaces
{
    public interface INormativaService
    {
        Task<PagedResult<NormativaDto>> GetPagedAsync(
            string? searchQuery,
            int pageNumber,
            int pageSize,
            string? sortBy,
            string? sortOrder);

        Task<List<NormativaSimpleDto>> GetActiveListAsync();

        Task<NormativaDto?> GetByIdAsync(int id);

        Task<NormativaResultDto> CreateAsync(CreateNormativaRequest request, int userId);

        Task<NormativaResultDto> UpdateAsync(int id, UpdateNormativaRequest request, int userId);

        Task<NormativaResultDto> DeleteAsync(int id, int userId);
    }
}
