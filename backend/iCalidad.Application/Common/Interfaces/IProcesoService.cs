using iCalidad.Application.DTOs;

namespace iCalidad.Application.Common.Interfaces
{
    public interface IProcesoService
    {
        Task<PagedResult<ProcesoDto>> GetPagedAsync(
            string? searchQuery,
            int pageNumber,
            int pageSize,
            string? sortBy,
            string? sortOrder);

        Task<List<ProcesoSimpleDto>> GetActiveListAsync();

        Task<ProcesoDto?> GetByIdAsync(int id);

        Task<ProcesoResultDto> CreateAsync(CreateProcesoRequest request, int userId);

        Task<ProcesoResultDto> UpdateAsync(int id, UpdateProcesoRequest request, int userId);

        Task<ProcesoResultDto> DeleteAsync(int id, int userId);

        // SubProcesos
        Task<List<SubProcesoDto>> GetSubProcesosAsync(int idProceso);

        Task<SubProcesoDto?> GetSubProcesoByIdAsync(int idSubProceso);

        Task<SubProcesoResultDto> CreateSubProcesoAsync(CreateSubProcesoRequest request, int userId);

        Task<SubProcesoResultDto> UpdateSubProcesoAsync(int idSubProceso, UpdateSubProcesoRequest request, int userId);

        Task<SubProcesoResultDto> DeleteSubProcesoAsync(int idSubProceso, int userId);
    }
}
