using iCalidad.Application.DTOs;
using iCalidad.Application.Services;
using iCalidad.Domain.Entities;
using iCalidad.UnitTests.Common;

namespace iCalidad.UnitTests.Services
{
    public class PuestoServiceTests
    {
        [Fact]
        public async Task CreateAsync_ValidRequest_CreatesPuestoSuccessfully()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            db.Departamentos.Add(new Departamento
            {
                IdDepartamento = 1,
                NombreDepartamento = "Sistemas",
                ClaveDepartamento = "SIS",
                IdEstatusDepartamento = true
            });
            await db.SaveChangesAsync();

            var service = new PuestoService(db);
            var request = new CreatePuestoRequest
            {
                NombrePuesto = "Desarrollador Senior",
                IdDepartamento = 1
            };

            // Act
            var result = await service.CreateAsync(request, userId: 10);

            // Assert
            Assert.True(result.Resultado > 0);
            Assert.Equal("Puesto creado exitosamente.", result.Mensaje);
            var saved = await db.Puestos.FindAsync(result.Resultado);
            Assert.NotNull(saved);
            Assert.Equal("Desarrollador Senior", saved.NombrePuesto);
            Assert.Equal(1, saved.IdDepartamento);
            Assert.Equal(10, saved.IdEmpleadoAlta);
        }

        [Fact]
        public async Task CreateAsync_DuplicateActiveNombre_ReturnsError()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            db.Departamentos.Add(new Departamento
            {
                IdDepartamento = 1,
                NombreDepartamento = "Sistemas",
                ClaveDepartamento = "SIS",
                IdEstatusDepartamento = true
            });
            db.Puestos.Add(new Puesto
            {
                IdPuesto = 1,
                NombrePuesto = "Analista",
                IdDepartamento = 1,
                IdEstatusPuesto = true
            });
            await db.SaveChangesAsync();

            var service = new PuestoService(db);

            // Act
            var result = await service.CreateAsync(new CreatePuestoRequest
            {
                NombrePuesto = "analista",
                IdDepartamento = 1
            }, userId: 10);

            // Assert
            Assert.Equal(-1, result.Resultado);
            Assert.Equal("Ya existe un puesto activo con ese nombre.", result.Mensaje);
        }

        [Fact]
        public async Task UpdateAsync_ValidRequest_UpdatesPuesto()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            db.Departamentos.Add(new Departamento
            {
                IdDepartamento = 1,
                NombreDepartamento = "Sistemas",
                ClaveDepartamento = "SIS",
                IdEstatusDepartamento = true
            });
            var puesto = new Puesto
            {
                IdPuesto = 1,
                NombrePuesto = "Programador",
                IdDepartamento = 1,
                IdEstatusPuesto = true
            };
            db.Puestos.Add(puesto);
            await db.SaveChangesAsync();

            var service = new PuestoService(db);

            // Act
            var result = await service.UpdateAsync(1, new UpdatePuestoRequest
            {
                IdPuesto = 1,
                NombrePuesto = "Ingeniero de Software",
                IdDepartamento = 1,
                IdEstatusPuesto = true
            }, userId: 20);

            // Assert
            Assert.Equal(1, result.Resultado);
            var updated = await db.Puestos.FindAsync(1);
            Assert.NotNull(updated);
            Assert.Equal("Ingeniero de Software", updated.NombrePuesto);
            Assert.Equal(20, updated.IdEmpleadoActualiza);
        }

        [Fact]
        public async Task DeleteAsync_ExistingPuesto_DeletesPuesto()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            var puesto = new Puesto
            {
                IdPuesto = 1,
                NombrePuesto = "Temporal",
                IdDepartamento = 1,
                IdEstatusPuesto = true
            };
            db.Puestos.Add(puesto);
            await db.SaveChangesAsync();

            var service = new PuestoService(db);

            // Act
            var result = await service.DeleteAsync(1, userId: 10);

            // Assert
            Assert.Equal(1, result.Resultado);
            var exists = await db.Puestos.FindAsync(1);
            Assert.Null(exists);
        }
    }
}
