using iCalidad.Application.DTOs;

namespace iCalidad.Application.Common.Interfaces
{
    public interface IMenuService
    {
        Task<List<MenuItemDto>> GetMenuByEmployeeAsync(int employeeId);
    }
}
