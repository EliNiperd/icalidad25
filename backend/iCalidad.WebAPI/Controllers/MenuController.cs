using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using iCalidad.Application.Common.Interfaces;

namespace iCalidad.WebAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class MenuController : ControllerBase
    {
        private readonly IMenuService _menuService;

        public MenuController(IMenuService menuService)
        {
            _menuService = menuService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMenu()
        {
            // Extraer el Id del empleado desde los Claims del Token JWT
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                ?? User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var employeeId))
            {
                return Unauthorized(new { Message = "Token inválido o sin identificador de empleado." });
            }

            var menuItems = await _menuService.GetMenuByEmployeeAsync(employeeId);
            return Ok(menuItems);
        }
    }
}
