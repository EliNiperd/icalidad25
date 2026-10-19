using iCalidad.Application.DTOs;
using iCalidad.Application.Services;
using iCalidad.Domain.Entities;
using iCalidad.UnitTests.Common;

namespace iCalidad.UnitTests.Services
{
    public class RequisitoServiceTests
    {
        [Fact]
        public async Task CreateAsync_ValidRequest_CreatesRequisitoSuccessfully()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            db.Normativas.Add(new Normativa
            {
                IdNormativa = 1,
                ClaveNormativa = "ISO9001",
                NombreNormativa = "ISO 9001:2015",
                IdEstatusNormativa = true
            });
            await db.SaveChangesAsync();

            var service = new RequisitoService(db);
            var request = new CreateRequisitoRequest
            {
                IdNormativa = 1,
                ClaveRequisito = "4.1",
                NombreRequisito = "Comprensión de la organización",
                TextoRequisito = "La organización debe determinar las cuestiones externas e internas..."
            };

            // Act
            var result = await service.CreateAsync(request, userId: 10);

            // Assert
            Assert.True(result.Resultado > 0);
            Assert.Equal("Requisito creado exitosamente.", result.Mensaje);
            var saved = await db.Requisitos.FindAsync(result.Resultado);
            Assert.NotNull(saved);
            Assert.Equal("4.1", saved.ClaveRequisito);
            Assert.Equal(1, saved.IdNormativa);
            Assert.Equal(10, saved.IdEmpleadoAlta);
        }

        [Fact]
        public async Task CreateAsync_InactiveOrNonExistentNormativa_ReturnsError()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            var service = new RequisitoService(db);

            // Act
            var result = await service.CreateAsync(new CreateRequisitoRequest
            {
                IdNormativa = 999,
                ClaveRequisito = "1.0",
                NombreRequisito = "Requisito huérfano"
            }, userId: 10);

            // Assert
            Assert.Equal(-1, result.Resultado);
            Assert.Equal("La normativa seleccionada no existe o no está activa.", result.Mensaje);
        }

        [Fact]
        public async Task CreateAsync_DuplicateClaveInSameNormativa_ReturnsError()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            db.Normativas.Add(new Normativa
            {
                IdNormativa = 1,
                ClaveNormativa = "ISO9001",
                NombreNormativa = "ISO 9001:2015",
                IdEstatusNormativa = true
            });
            db.Requisitos.Add(new Requisito
            {
                IdRequisito = 1,
                IdNormativa = 1,
                ClaveRequisito = "4.1",
                NombreRequisito = "Contexto",
                IdEstatusRequisito = true
            });
            await db.SaveChangesAsync();

            var service = new RequisitoService(db);

            // Act
            var result = await service.CreateAsync(new CreateRequisitoRequest
            {
                IdNormativa = 1,
                ClaveRequisito = "4.1",
                NombreRequisito = "Otro contexto"
            }, userId: 10);

            // Assert
            Assert.Equal(-1, result.Resultado);
            Assert.Equal("Ya existe un requisito con esa clave para la normativa seleccionada.", result.Mensaje);
        }

        [Fact]
        public async Task UpdateAsync_ValidRequest_UpdatesRequisito()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            db.Normativas.Add(new Normativa
            {
                IdNormativa = 1,
                ClaveNormativa = "ISO9001",
                NombreNormativa = "ISO 9001:2015",
                IdEstatusNormativa = true
            });
            db.Requisitos.Add(new Requisito
            {
                IdRequisito = 1,
                IdNormativa = 1,
                ClaveRequisito = "5.1",
                NombreRequisito = "Liderazgo",
                IdEstatusRequisito = true
            });
            await db.SaveChangesAsync();

            var service = new RequisitoService(db);

            // Act
            var result = await service.UpdateAsync(1, new UpdateRequisitoRequest
            {
                IdRequisito = 1,
                IdNormativa = 1,
                ClaveRequisito = "5.1",
                NombreRequisito = "Liderazgo y compromiso",
                TextoRequisito = "La alta dirección debe demostrar liderazgo...",
                IdEstatusRequisito = true
            }, userId: 20);

            // Assert
            Assert.Equal(1, result.Resultado);
            var updated = await db.Requisitos.FindAsync(1);
            Assert.NotNull(updated);
            Assert.Equal("Liderazgo y compromiso", updated.NombreRequisito);
            Assert.Equal(20, updated.IdEmpleadoActualiza);
        }

        [Fact]
        public async Task DeleteAsync_ExistingRequisito_DeletesSuccessfully()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            db.Requisitos.Add(new Requisito
            {
                IdRequisito = 1,
                IdNormativa = 1,
                ClaveRequisito = "TEMP",
                NombreRequisito = "Requisito Temporal",
                IdEstatusRequisito = true
            });
            await db.SaveChangesAsync();

            var service = new RequisitoService(db);

            // Act
            var result = await service.DeleteAsync(1, userId: 10);

            // Assert
            Assert.Equal(1, result.Resultado);
            var exists = await db.Requisitos.FindAsync(1);
            Assert.Null(exists);
        }
    }
}
