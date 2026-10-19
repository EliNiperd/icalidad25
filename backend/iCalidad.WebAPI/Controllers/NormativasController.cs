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
    public class NormativasController : ControllerBase
    {
        private readonly INormativaService _normativaService;

        public NormativasController(INormativaService normativaService)
        {
            _normativaService = normativaService;
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
            [FromQuery] string? sortBy = "NombreNormativa",
            [FromQuery] string? sortOrder = "ASC")
        {
            var result = await _normativaService.GetPagedAsync(query, pageNumber, pageSize, sortBy, sortOrder);
            return Ok(result);
        }

        [HttpGet("list")]
        public async Task<IActionResult> GetActiveList()
        {
            var result = await _normativaService.GetActiveListAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var normativa = await _normativaService.GetByIdAsync(id);
            if (normativa == null)
            {
                return NotFound(new NormativaResultDto
                {
                    Resultado = -1,
                    Mensaje = $"No se encontró la normativa con ID {id}."
                });
            }
            return Ok(normativa);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateNormativaRequest request)
        {
            var userId = GetCurrentUserId();
            if (userId <= 0)
            {
                return Unauthorized(new NormativaResultDto
                {
                    Resultado = -1,
                    Mensaje = "No se pudo identificar al usuario autenticado para la auditoría."
                });
            }

            var result = await _normativaService.CreateAsync(request, userId);

            if (result.Resultado < 0)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateNormativaRequest request)
        {
            var userId = GetCurrentUserId();
            if (userId <= 0)
            {
                return Unauthorized(new NormativaResultDto
                {
                    Resultado = -1,
                    Mensaje = "No se pudo identificar al usuario autenticado para la auditoría."
                });
            }

            var result = await _normativaService.UpdateAsync(id, request, userId);

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
                return Unauthorized(new NormativaResultDto
                {
                    Resultado = -1,
                    Mensaje = "No se pudo identificar al usuario autenticado para la auditoría."
                });
            }

            var result = await _normativaService.DeleteAsync(id, userId);

            if (result.Resultado < 0)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}
