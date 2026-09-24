using Moq;
using iCalidad.Application.Common.Interfaces;
using iCalidad.Application.DTOs;
using iCalidad.Application.Services;
using iCalidad.Domain.Entities;
using iCalidad.UnitTests.Common;

namespace iCalidad.UnitTests.Services
{
    public class AuthenticationServiceTests
    {
        private readonly Mock<ITokenService> _tokenServiceMock;

        public AuthenticationServiceTests()
        {
            _tokenServiceMock = new Mock<ITokenService>();
            _tokenServiceMock
                .Setup(t => t.GenerateToken(It.IsAny<Empleado>(), It.IsAny<List<string>>()))
                .Returns("mocked-jwt-token");
        }

        [Fact]
        public async Task AuthenticateAsync_ValidCredentials_ReturnsAuthResponseWithToken()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            var empleado = new Empleado
            {
                IdEmpleado = 1,
                UserName = "jdoe",
                NombreEmpleado = "John Doe",
                Password = "SecretPassword123", // Texto plano soportado
                IdEstatusEmpleado = true,
                Correo = "jdoe@example.com"
            };
            var rol = new Rol { IdRol = 1, NombreRol = "Administrador" };
            var empleadoRol = new EmpleadoRol { IdEmpleado = 1, IdRol = 1, Empleado = empleado, Rol = rol };

            db.Empleados.Add(empleado);
            db.Roles.Add(rol);
            db.EmpleadosRoles.Add(empleadoRol);
            await db.SaveChangesAsync();

            var service = new AuthenticationService(db, _tokenServiceMock.Object);

            // Act
            var result = await service.AuthenticateAsync(new LoginRequest
            {
                Username = "jdoe",
                Password = "SecretPassword123"
            });

            // Assert
            Assert.NotNull(result);
            Assert.Equal("jdoe", result.UserName);
            Assert.Equal(1, result.IdEmpleado);
            Assert.Equal("mocked-jwt-token", result.Token);
            Assert.Contains("Administrador", result.Roles);
        }

        [Fact]
        public async Task AuthenticateAsync_InvalidPassword_ReturnsNull()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            db.Empleados.Add(new Empleado
            {
                IdEmpleado = 2,
                UserName = "activeuser",
                Password = "CorrectPassword",
                IdEstatusEmpleado = true
            });
            await db.SaveChangesAsync();

            var service = new AuthenticationService(db, _tokenServiceMock.Object);

            // Act
            var result = await service.AuthenticateAsync(new LoginRequest
            {
                Username = "activeuser",
                Password = "WrongPassword"
            });

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task AuthenticateAsync_InactiveUser_ReturnsNull()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            db.Empleados.Add(new Empleado
            {
                IdEmpleado = 3,
                UserName = "inactiveuser",
                Password = "SomePassword",
                IdEstatusEmpleado = false
            });
            await db.SaveChangesAsync();

            var service = new AuthenticationService(db, _tokenServiceMock.Object);

            // Act
            var result = await service.AuthenticateAsync(new LoginRequest
            {
                Username = "inactiveuser",
                Password = "SomePassword"
            });

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task AuthenticateAsync_NonExistentUser_ReturnsNull()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            var service = new AuthenticationService(db, _tokenServiceMock.Object);

            // Act
            var result = await service.AuthenticateAsync(new LoginRequest
            {
                Username = "nobody",
                Password = "password"
            });

            // Assert
            Assert.Null(result);
        }
    }
}
