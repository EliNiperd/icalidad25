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
    public class ProcesosController : ControllerBase
    {
        private readonly IProcesoService _procesoService;

        public ProcesosController(IProcesoService procesoService)
        {
            _procesoService = procesoService;
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
            [FromQuery] string? sortBy = "NombreProceso",
            [FromQuery] string? sortOrder = "ASC")
        {
            var result = await _procesoService.GetPagedAsync(query, pageNumber, pageSize, sortBy, sortOrder);
            return Ok(result);
        }

        [HttpGet("list")]
        public async Task<IActionResult> GetActiveList()
        {
            var result = await _procesoService.GetActiveListAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var proceso = await _procesoService.GetByIdAsync(id);
            if (proceso == null)
            {
                return NotFound(new ProcesoResultDto
                {
                    Resultado = -1,
                    Mensaje = $"No se encontró el proceso con ID {id}."
                });
            }
            return Ok(proceso);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateProcesoRequest request)
        {
            var userId = GetCurrentUserId();
            if (userId <= 0)
            {
                return Unauthorized(new ProcesoResultDto
                {
                    Resultado = -1,
                    Mensaje = "No se pudo identificar al usuario autenticado para la auditoría."
                });
            }

            var result = await _procesoService.CreateAsync(request, userId);

            if (result.Resultado < 0)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateProcesoRequest request)
        {
            var userId = GetCurrentUserId();
            if (userId <= 0)
            {
                return Unauthorized(new ProcesoResultDto
                {
                    Resultado = -1,
                    Mensaje = "No se pudo identificar al usuario autenticado para la auditoría."
                });
            }

            var result = await _procesoService.UpdateAsync(id, request, userId);

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
                return Unauthorized(new ProcesoResultDto
                {
                    Resultado = -1,
                    Mensaje = "No se pudo identificar al usuario autenticado para la auditoría."
                });
            }

            var result = await _procesoService.DeleteAsync(id, userId);

            if (result.Resultado < 0)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        // ========== Endpoints de SubProcesos ==========

        [HttpGet("{id}/subprocesos")]
        public async Task<IActionResult> GetSubProcesos(int id)
        {
            var result = await _procesoService.GetSubProcesosAsync(id);
            return Ok(result);
        }

        [HttpGet("subprocesos/{idSubProceso}")]
        public async Task<IActionResult> GetSubProcesoById(int idSubProceso)
        {
            var sp = await _procesoService.GetSubProcesoByIdAsync(idSubProceso);
            if (sp == null)
            {
                return NotFound(new SubProcesoResultDto
                {
                    Resultado = -1,
                    Mensaje = $"No se encontró el subproceso con ID {idSubProceso}."
                });
            }
            return Ok(sp);
        }

        [HttpPost("{id}/subprocesos")]
        public async Task<IActionResult> CreateSubProceso(int id, [FromBody] CreateSubProcesoRequest request)
        {
            var userId = GetCurrentUserId();
            if (userId <= 0)
            {
                return Unauthorized(new SubProcesoResultDto
                {
                    Resultado = -1,
                    Mensaje = "No se pudo identificar al usuario autenticado para la auditoría."
                });
            }

            request.IdProceso = id;
            var result = await _procesoService.CreateSubProcesoAsync(request, userId);

            if (result.Resultado < 0)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPut("subprocesos/{idSubProceso}")]
        public async Task<IActionResult> UpdateSubProceso(int idSubProceso, [FromBody] UpdateSubProcesoRequest request)
        {
            var userId = GetCurrentUserId();
            if (userId <= 0)
            {
                return Unauthorized(new SubProcesoResultDto
                {
                    Resultado = -1,
                    Mensaje = "No se pudo identificar al usuario autenticado para la auditoría."
                });
            }

            var result = await _procesoService.UpdateSubProcesoAsync(idSubProceso, request, userId);

            if (result.Resultado < 0)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpDelete("subprocesos/{idSubProceso}")]
        public async Task<IActionResult> DeleteSubProceso(int idSubProceso)
        {
            var userId = GetCurrentUserId();
            if (userId <= 0)
            {
                return Unauthorized(new SubProcesoResultDto
                {
                    Resultado = -1,
                    Mensaje = "No se pudo identificar al usuario autenticado para la auditoría."
                });
            }

            var result = await _procesoService.DeleteSubProcesoAsync(idSubProceso, userId);

            if (result.Resultado < 0)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}
