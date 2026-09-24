using iCalidad.Application.DTOs;
using iCalidad.Application.Services;
using iCalidad.Domain.Entities;
using iCalidad.UnitTests.Common;

namespace iCalidad.UnitTests.Services
{
    public class DepartamentoServiceTests
    {
        [Fact]
        public async Task CreateAsync_ValidRequest_CreatesDepartamentoSuccessfully()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            db.Gerencias.Add(new Gerencia
            {
                IdGerencia = 1,
                NombreGerencia = "Operaciones",
                ClaveGerencia = "OPS",
                IdEstatusGerencia = true
            });
            await db.SaveChangesAsync();

            var service = new DepartamentoService(db);
            var request = new CreateDepartamentoRequest
            {
                ClaveDepartamento = "MNT",
                NombreDepartamento = "Mantenimiento",
                IdGerencia = 1
            };

            // Act
            var result = await service.CreateAsync(request, userId: 10);

            // Assert
            Assert.True(result.Resultado > 0);
            Assert.Equal("Creación exitosa", result.Mensaje);
            var saved = await db.Departamentos.FindAsync(result.Resultado);
            Assert.NotNull(saved);
            Assert.Equal("MNT", saved.ClaveDepartamento);
            Assert.Equal("Mantenimiento", saved.NombreDepartamento);
            Assert.Equal(1, saved.IdGerencia);
            Assert.Equal(10, saved.IdEmpleadoAlta);
        }

        [Fact]
        public async Task CreateAsync_NonExistentGerencia_ReturnsError()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            var service = new DepartamentoService(db);

            // Act
            var result = await service.CreateAsync(new CreateDepartamentoRequest
            {
                ClaveDepartamento = "LOG",
                NombreDepartamento = "Logística",
                IdGerencia = 999
            }, userId: 10);

            // Assert
            Assert.Equal(-1, result.Resultado);
            Assert.Contains("no existe o no está activa", result.Mensaje);
        }

        [Fact]
        public async Task CreateAsync_DuplicateClave_ReturnsError()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            db.Gerencias.Add(new Gerencia
            {
                IdGerencia = 1,
                NombreGerencia = "Gerencia",
                ClaveGerencia = "G1",
                IdEstatusGerencia = true
            });
            db.Departamentos.Add(new Departamento
            {
                IdDepartamento = 1,
                ClaveDepartamento = "COMPRAS",
                NombreDepartamento = "Compras y Adquisiciones",
                IdGerencia = 1,
                IdEstatusDepartamento = true
            });
            await db.SaveChangesAsync();

            var service = new DepartamentoService(db);

            // Act
            var result = await service.CreateAsync(new CreateDepartamentoRequest
            {
                ClaveDepartamento = "COMPRAS",
                NombreDepartamento = "Otra Área",
                IdGerencia = 1
            }, userId: 10);

            // Assert
            Assert.Equal(-1, result.Resultado);
            Assert.Contains("Ya existe un departamento con la misma clave", result.Mensaje);
        }

        [Fact]
        public async Task UpdateAsync_ValidUpdate_UpdatesDepartamentoSuccessfully()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            db.Gerencias.Add(new Gerencia { IdGerencia = 1, NombreGerencia = "G1", ClaveGerencia = "G1", IdEstatusGerencia = true });
            db.Departamentos.Add(new Departamento
            {
                IdDepartamento = 1,
                ClaveDepartamento = "SIST",
                NombreDepartamento = "Sistemas",
                IdGerencia = 1,
                IdEstatusDepartamento = true
            });
            await db.SaveChangesAsync();

            var service = new DepartamentoService(db);

            // Act
            var result = await service.UpdateAsync(1, new UpdateDepartamentoRequest
            {
                IdDepartamento = 1,
                ClaveDepartamento = "TI",
                NombreDepartamento = "Tecnología e Informática",
                IdGerencia = 1,
                IdEstatusDepartamento = false
            }, userId: 20);

            // Assert
            Assert.Equal(1, result.Resultado);
            var updated = await db.Departamentos.FindAsync(1);
            Assert.NotNull(updated);
            Assert.Equal("TI", updated.ClaveDepartamento);
            Assert.Equal("Tecnología e Informática", updated.NombreDepartamento);
            Assert.False(updated.IdEstatusDepartamento);
            Assert.Equal(20, updated.IdEmpleadoActualiza);
        }

        [Fact]
        public async Task DeleteAsync_ExistingDepartamento_DeletesSuccessfully()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            db.Departamentos.Add(new Departamento
            {
                IdDepartamento = 5,
                ClaveDepartamento = "DEL",
                NombreDepartamento = "Para Borrar",
                IdGerencia = 1,
                IdEstatusDepartamento = true
            });
            await db.SaveChangesAsync();

            var service = new DepartamentoService(db);

            // Act
            var result = await service.DeleteAsync(5, userId: 1);

            // Assert
            Assert.Equal(1, result.Resultado);
            Assert.Null(await db.Departamentos.FindAsync(5));
        }
    }
}
