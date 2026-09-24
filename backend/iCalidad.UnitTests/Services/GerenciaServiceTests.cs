using iCalidad.Application.DTOs;
using iCalidad.Application.Services;
using iCalidad.Domain.Entities;
using iCalidad.UnitTests.Common;

namespace iCalidad.UnitTests.Services
{
    public class GerenciaServiceTests
    {
        [Fact]
        public async Task CreateAsync_ValidRequest_CreatesGerenciaSuccessfully()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            var service = new GerenciaService(db);
            var request = new CreateGerenciaRequest
            {
                ClaveGerencia = "DIR-GEN",
                NombreGerencia = "Dirección General"
            };

            // Act
            var result = await service.CreateAsync(request, userId: 100);

            // Assert
            Assert.True(result.Resultado > 0);
            Assert.Equal("Creación exitosa", result.Mensaje);
            var saved = await db.Gerencias.FindAsync(result.Resultado);
            Assert.NotNull(saved);
            Assert.Equal("DIR-GEN", saved.ClaveGerencia);
            Assert.Equal("Dirección General", saved.NombreGerencia);
            Assert.Equal(100, saved.IdEmpleadoAlta);
        }

        [Fact]
        public async Task CreateAsync_DuplicateClave_ReturnsError()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            db.Gerencias.Add(new Gerencia
            {
                IdGerencia = 1,
                ClaveGerencia = "DIR-TI",
                NombreGerencia = "Tecnologías de Información",
                IdEstatusGerencia = true
            });
            await db.SaveChangesAsync();

            var service = new GerenciaService(db);

            // Act
            var result = await service.CreateAsync(new CreateGerenciaRequest
            {
                ClaveGerencia = "DIR-TI",
                NombreGerencia = "Otra Dirección"
            }, userId: 1);

            // Assert
            Assert.Equal(-1, result.Resultado);
            Assert.Contains("Ya existe un registro", result.Mensaje);
        }

        [Fact]
        public async Task DeleteAsync_GerenciaWithDepartamentos_PreventsDeletion()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            db.Gerencias.Add(new Gerencia
            {
                IdGerencia = 1,
                ClaveGerencia = "G-ADM",
                NombreGerencia = "Gerencia Administrativa",
                IdEstatusGerencia = true
            });
            db.Departamentos.Add(new Departamento
            {
                IdDepartamento = 1,
                IdGerencia = 1,
                NombreDepartamento = "Recursos Humanos",
                ClaveDepartamento = "RH",
                IdEstatusDepartamento = true
            });
            await db.SaveChangesAsync();

            var service = new GerenciaService(db);

            // Act
            var result = await service.DeleteAsync(1, userId: 1);

            // Assert
            Assert.Equal(-1, result.Resultado);
            Assert.Contains("asociados", result.Mensaje);
            Assert.NotNull(await db.Gerencias.FindAsync(1));
        }

        [Fact]
        public async Task DeleteAsync_GerenciaWithoutDepartamentos_DeletesSuccessfully()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            db.Gerencias.Add(new Gerencia
            {
                IdGerencia = 2,
                ClaveGerencia = "G-EMPTY",
                NombreGerencia = "Gerencia Sin Deptos",
                IdEstatusGerencia = true
            });
            await db.SaveChangesAsync();

            var service = new GerenciaService(db);

            // Act
            var result = await service.DeleteAsync(2, userId: 1);

            // Assert
            Assert.Equal(1, result.Resultado);
            Assert.Null(await db.Gerencias.FindAsync(2));
        }
    }
}
