using iCalidad.Application.DTOs;
using iCalidad.Application.Services;
using iCalidad.Domain.Entities;
using iCalidad.UnitTests.Common;

namespace iCalidad.UnitTests.Services
{
    public class NormativaServiceTests
    {
        [Fact]
        public async Task CreateAsync_ValidRequest_CreatesNormativaSuccessfully()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            var service = new NormativaService(db);
            var request = new CreateNormativaRequest
            {
                ClaveNormativa = "ISO9001",
                NombreNormativa = "ISO 9001:2015"
            };

            // Act
            var result = await service.CreateAsync(request, userId: 10);

            // Assert
            Assert.True(result.Resultado > 0);
            Assert.Equal("Normativa creada exitosamente.", result.Mensaje);
            var saved = await db.Normativas.FindAsync(result.Resultado);
            Assert.NotNull(saved);
            Assert.Equal("ISO9001", saved.ClaveNormativa);
            Assert.Equal("ISO 9001:2015", saved.NombreNormativa);
            Assert.Equal(10, saved.IdEmpleadoAlta);
        }

        [Fact]
        public async Task CreateAsync_DuplicateClaveOrNombre_ReturnsError()
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

            var service = new NormativaService(db);

            // Act
            var result = await service.CreateAsync(new CreateNormativaRequest
            {
                ClaveNormativa = "iso9001",
                NombreNormativa = "Otra Normativa"
            }, userId: 10);

            // Assert
            Assert.Equal(-1, result.Resultado);
            Assert.Equal("Ya existe una normativa con esa clave o nombre.", result.Mensaje);
        }

        [Fact]
        public async Task UpdateAsync_ValidRequest_UpdatesNormativa()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            db.Normativas.Add(new Normativa
            {
                IdNormativa = 1,
                ClaveNormativa = "ISO14001",
                NombreNormativa = "ISO 14001:2004",
                IdEstatusNormativa = true
            });
            await db.SaveChangesAsync();

            var service = new NormativaService(db);

            // Act
            var result = await service.UpdateAsync(1, new UpdateNormativaRequest
            {
                IdNormativa = 1,
                ClaveNormativa = "ISO14001",
                NombreNormativa = "ISO 14001:2015",
                IdEstatusNormativa = true
            }, userId: 20);

            // Assert
            Assert.Equal(1, result.Resultado);
            var updated = await db.Normativas.FindAsync(1);
            Assert.NotNull(updated);
            Assert.Equal("ISO 14001:2015", updated.NombreNormativa);
            Assert.Equal(20, updated.IdEmpleadoActualiza);
        }

        [Fact]
        public async Task DeleteAsync_WithAssociatedRequisitos_ReturnsError()
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
                NombreRequisito = "Contexto de la organización"
            });
            await db.SaveChangesAsync();

            var service = new NormativaService(db);

            // Act
            var result = await service.DeleteAsync(1, userId: 10);

            // Assert
            Assert.Equal(-1, result.Resultado);
            Assert.Equal("No es posible eliminar la normativa porque tiene requisitos asociados.", result.Mensaje);
        }

        [Fact]
        public async Task DeleteAsync_NoRequisitos_DeletesSuccessfully()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            db.Normativas.Add(new Normativa
            {
                IdNormativa = 1,
                ClaveNormativa = "TEMP",
                NombreNormativa = "Normativa Temporal",
                IdEstatusNormativa = true
            });
            await db.SaveChangesAsync();

            var service = new NormativaService(db);

            // Act
            var result = await service.DeleteAsync(1, userId: 10);

            // Assert
            Assert.Equal(1, result.Resultado);
            var exists = await db.Normativas.FindAsync(1);
            Assert.Null(exists);
        }
    }
}
