using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using iCalidad.Application.Common.Interfaces;
using iCalidad.Application.DTOs;

namespace iCalidad.WebAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class EmpleadosController : ControllerBase
    {
        private readonly IEmpleadoService _empleadoService;

        public EmpleadosController(IEmpleadoService empleadoService)
        {
            _empleadoService = empleadoService;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                ?? User.FindFirst("sub")?.Value
                ?? User.FindFirst("id")?.Value
                ?? User.FindFirst("IdEmpleado")?.Value;

            return int.TryParse(userIdClaim, out var userId) ? userId : 0;
        }

        [HttpGet]
        public async Task<IActionResult> GetPaged(
            [FromQuery] string? query = null,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? sortBy = "NombreEmpleado",
            [FromQuery] string? sortOrder = "ASC")
        {
            var result = await _empleadoService.GetPagedAsync(query, pageNumber, pageSize, sortBy, sortOrder);
            return Ok(result);
        }

        [HttpGet("list")]
        public async Task<IActionResult> GetActiveList()
        {
            var result = await _empleadoService.GetActiveListAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var empleado = await _empleadoService.GetByIdAsync(id);
            if (empleado == null)
            {
                return NotFound(new EmpleadoResultDto
                {
                    Resultado = -1,
                    Mensaje = $"No se encontró el empleado con ID {id}."
                });
            }
            return Ok(empleado);
        }

        [HttpGet("{id}/puestos")]
        public async Task<IActionResult> GetPuestos(int id)
        {
            var puestos = await _empleadoService.GetPuestosByEmpleadoAsync(id);
            return Ok(puestos);
        }

        [HttpGet("{id}/roles")]
        public async Task<IActionResult> GetRoles(int id)
        {
            var roles = await _empleadoService.GetRolesByEmpleadoAsync(id);
            return Ok(roles);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateEmpleadoRequest request)
        {
            var userId = GetCurrentUserId();
            var result = await _empleadoService.CreateAsync(request, userId);

            if (result.Resultado < 0)
            {
                return BadRequest(result);
            }

            return CreatedAtAction(nameof(GetById), new { id = result.Resultado }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateEmpleadoRequest request)
        {
            var userId = GetCurrentUserId();
            var result = await _empleadoService.UpdateAsync(id, request, userId);

            if (result.Resultado < 0)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = GetCurrentUserId();
            var result = await _empleadoService.DeleteAsync(id, userId);

            if (result.Resultado < 0)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}
