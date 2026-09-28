using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using iCalidad.Application.Common.Interfaces;
using iCalidad.Application.DTOs;

namespace iCalidad.WebAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class RolesController : ControllerBase
    {
        private readonly IApplicationDbContext _context;

        public RolesController(IApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("list")]
        public async Task<IActionResult> GetActiveList()
        {
            var roles = await _context.Roles
                .Where(r => r.IdEstatusRol)
                .OrderBy(r => r.NombreRol)
                .Select(r => new RolAsignadoDto
                {
                    IdRol = r.IdRol,
                    NombreRol = r.NombreRol
                })
                .ToListAsync();

            return Ok(roles);
        }
    }
}
