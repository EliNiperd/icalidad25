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
    public class PuestosController : ControllerBase
    {
        private readonly IPuestoService _puestoService;

        public PuestosController(IPuestoService puestoService)
        {
            _puestoService = puestoService;
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
            [FromQuery] string? sortBy = "NombrePuesto",
            [FromQuery] string? sortOrder = "ASC")
        {
            var result = await _puestoService.GetPagedAsync(query, pageNumber, pageSize, sortBy, sortOrder);
            return Ok(result);
        }

        [HttpGet("list")]
        public async Task<IActionResult> GetActiveList([FromQuery] int? idDepartamento = null)
        {
            var result = await _puestoService.GetActiveListAsync(idDepartamento);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var puesto = await _puestoService.GetByIdAsync(id);
            if (puesto == null)
            {
                return NotFound(new PuestoResultDto
                {
                    Resultado = -1,
                    Mensaje = $"No se encontró el puesto con ID {id}."
                });
            }
            return Ok(puesto);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePuestoRequest request)
        {
            var userId = GetCurrentUserId();
            if (userId <= 0)
            {
                return Unauthorized(new PuestoResultDto
                {
                    Resultado = -1,
                    Mensaje = "No se pudo identificar al usuario autenticado para la auditoría."
                });
            }

            var result = await _puestoService.CreateAsync(request, userId);

            if (result.Resultado < 0)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdatePuestoRequest request)
        {
            var userId = GetCurrentUserId();
            if (userId <= 0)
            {
                return Unauthorized(new PuestoResultDto
                {
                    Resultado = -1,
                    Mensaje = "No se pudo identificar al usuario autenticado para la auditoría."
                });
            }

            var result = await _puestoService.UpdateAsync(id, request, userId);

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
                return Unauthorized(new PuestoResultDto
                {
                    Resultado = -1,
                    Mensaje = "No se pudo identificar al usuario autenticado para la auditoría."
                });
            }

            var result = await _puestoService.DeleteAsync(id, userId);

            if (result.Resultado < 0)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}
