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
    public class DepartamentosController : ControllerBase
    {
        private readonly IDepartamentoService _departamentoService;

        public DepartamentosController(IDepartamentoService departamentoService)
        {
            _departamentoService = departamentoService;
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
            [FromQuery] string? sortBy = "NombreDepartamento",
            [FromQuery] string? sortOrder = "ASC")
        {
            var result = await _departamentoService.GetPagedAsync(query, pageNumber, pageSize, sortBy, sortOrder);
            return Ok(result);
        }

        [HttpGet("list")]
        public async Task<IActionResult> GetActiveList([FromQuery] int? idGerencia = null)
        {
            var result = await _departamentoService.GetActiveListAsync(idGerencia);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var depto = await _departamentoService.GetByIdAsync(id);
            if (depto == null)
            {
                return NotFound(new DepartamentoResultDto
                {
                    Resultado = -1,
                    Mensaje = $"No se encontró el departamento con ID {id}."
                });
            }
            return Ok(depto);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateDepartamentoRequest request)
        {
            var userId = GetCurrentUserId();
            if (userId <= 0)
            {
                return Unauthorized(new DepartamentoResultDto
                {
                    Resultado = -1,
                    Mensaje = "No se pudo identificar al usuario autenticado para la auditoría."
                });
            }

            var result = await _departamentoService.CreateAsync(request, userId);

            if (result.Resultado < 0)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateDepartamentoRequest request)
        {
            var userId = GetCurrentUserId();
            if (userId <= 0)
            {
                return Unauthorized(new DepartamentoResultDto
                {
                    Resultado = -1,
                    Mensaje = "No se pudo identificar al usuario autenticado para la auditoría."
                });
            }

            var result = await _departamentoService.UpdateAsync(id, request, userId);

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
            if (userId <= 0)
            {
                return Unauthorized(new DepartamentoResultDto
                {
                    Resultado = -1,
                    Mensaje = "No se pudo identificar al usuario autenticado para la auditoría."
                });
            }

            var result = await _departamentoService.DeleteAsync(id, userId);

            if (result.Resultado < 0)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}
