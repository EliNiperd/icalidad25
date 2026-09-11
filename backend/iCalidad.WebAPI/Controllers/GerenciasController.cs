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
    public class GerenciasController : ControllerBase
    {
        private readonly IGerenciaService _gerenciaService;

        public GerenciasController(IGerenciaService gerenciaService)
        {
            _gerenciaService = gerenciaService;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                ?? User.FindFirst("sub")?.Value;

            return int.TryParse(userIdClaim, out var userId) ? userId : 0;
        }

        [HttpGet]
        public async Task<IActionResult> GetPaged(
            [FromQuery] string? query = null,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? sortBy = "NombreGerencia",
            [FromQuery] string? sortOrder = "ASC")
        {
            var result = await _gerenciaService.GetPagedAsync(query, pageNumber, pageSize, sortBy, sortOrder);
            return Ok(result);
        }

        [HttpGet("list")]
        public async Task<IActionResult> GetActiveList()
        {
            var result = await _gerenciaService.GetActiveListAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var gerencia = await _gerenciaService.GetByIdAsync(id);
            if (gerencia == null)
            {
                return NotFound(new { Message = $"No se encontró la gerencia con ID {id}." });
            }
            return Ok(gerencia);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateGerenciaRequest request)
        {
            var userId = GetCurrentUserId();
            var result = await _gerenciaService.CreateAsync(request, userId);

            if (result.Resultado < 0)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateGerenciaRequest request)
        {
            var userId = GetCurrentUserId();
            var result = await _gerenciaService.UpdateAsync(id, request, userId);

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
            var result = await _gerenciaService.DeleteAsync(id, userId);

            if (result.Resultado < 0)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}
