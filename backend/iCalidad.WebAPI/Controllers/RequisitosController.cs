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
    public class RequisitosController : ControllerBase
    {
        private readonly IRequisitoService _requisitoService;

        public RequisitosController(IRequisitoService requisitoService)
        {
            _requisitoService = requisitoService;
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
            [FromQuery] int? idNormativa = null,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? sortBy = "ClaveRequisito",
            [FromQuery] string? sortOrder = "ASC")
        {
            var result = await _requisitoService.GetPagedAsync(query, idNormativa, pageNumber, pageSize, sortBy, sortOrder);
            return Ok(result);
        }

        [HttpGet("normativa/{idNormativa}")]
        public async Task<IActionResult> GetByNormativa(int idNormativa)
        {
            var result = await _requisitoService.GetActiveListByNormativaAsync(idNormativa);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var requisito = await _requisitoService.GetByIdAsync(id);
            if (requisito == null)
            {
                return NotFound(new RequisitoResultDto
                {
                    Resultado = -1,
                    Mensaje = $"No se encontró el requisito con ID {id}."
                });
            }
            return Ok(requisito);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateRequisitoRequest request)
        {
            var userId = GetCurrentUserId();
            if (userId <= 0)
            {
                return Unauthorized(new RequisitoResultDto
                {
                    Resultado = -1,
                    Mensaje = "No se pudo identificar al usuario autenticado para la auditoría."
                });
            }

            var result = await _requisitoService.CreateAsync(request, userId);

            if (result.Resultado < 0)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateRequisitoRequest request)
        {
            var userId = GetCurrentUserId();
            if (userId <= 0)
            {
                return Unauthorized(new RequisitoResultDto
                {
                    Resultado = -1,
                    Mensaje = "No se pudo identificar al usuario autenticado para la auditoría."
                });
            }

            var result = await _requisitoService.UpdateAsync(id, request, userId);

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
                return Unauthorized(new RequisitoResultDto
                {
                    Resultado = -1,
                    Mensaje = "No se pudo identificar al usuario autenticado para la auditoría."
                });
            }

            var result = await _requisitoService.DeleteAsync(id, userId);

            if (result.Resultado < 0)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}
