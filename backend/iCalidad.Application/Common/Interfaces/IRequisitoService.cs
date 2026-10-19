using iCalidad.Application.DTOs;

namespace iCalidad.Application.Common.Interfaces
{
    public interface IRequisitoService
    {
        Task<PagedResult<RequisitoDto>> GetPagedAsync(
            string? searchQuery,
            int? idNormativa,
            int pageNumber,
            int pageSize,
            string? sortBy,
            string? sortOrder);

        Task<List<RequisitoDto>> GetActiveListByNormativaAsync(int idNormativa);

        Task<RequisitoDto?> GetByIdAsync(int id);

        Task<RequisitoResultDto> CreateAsync(CreateRequisitoRequest request, int userId);

        Task<RequisitoResultDto> UpdateAsync(int id, UpdateRequisitoRequest request, int userId);

        Task<RequisitoResultDto> DeleteAsync(int id, int userId);
    }
}
