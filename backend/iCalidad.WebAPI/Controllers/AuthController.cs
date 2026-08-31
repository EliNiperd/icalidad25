using Microsoft.AspNetCore.Mvc;
using iCalidad.Application.Common.Interfaces;
using iCalidad.Application.DTOs;

namespace iCalidad.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthenticationService _authService;

        public AuthController(IAuthenticationService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { Message = "El usuario y contraseña son obligatorios." });
            }

            var result = await _authService.AuthenticateAsync(request);

            if (result == null)
            {
                // Retorna un mensaje amigable y explícito
                return Unauthorized(new { Message = "Usuario o contraseña incorrectos, o cuenta inactiva." });
            }

            return Ok(result);
        }
    }
}
