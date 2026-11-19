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

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Identifier))
            {
                return BadRequest(new { Message = "Ingresa tu usuario o correo electrónico." });
            }

            var result = await _authService.ForgotPasswordAsync(request);
            return Ok(result);
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Token) || string.IsNullOrWhiteSpace(request.NewPassword))
            {
                return BadRequest(new { Message = "El token y la nueva contraseña son obligatorios." });
            }

            if (request.NewPassword.Length < 6)
            {
                return BadRequest(new { Message = "La contraseña debe tener al menos 6 caracteres." });
            }

            var result = await _authService.ResetPasswordAsync(request);
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}
