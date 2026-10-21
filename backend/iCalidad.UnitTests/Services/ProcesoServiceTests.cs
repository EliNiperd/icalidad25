using iCalidad.Application.DTOs;
using iCalidad.Application.Services;
using iCalidad.Domain.Entities;
using iCalidad.UnitTests.Common;

namespace iCalidad.UnitTests.Services
{
    public class ProcesoServiceTests
    {
        [Fact]
        public async Task CreateAsync_ValidRequest_CreatesProcesoSuccessfully()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            db.Empleados.Add(new Empleado
            {
                IdEmpleado = 5,
                NombreEmpleado = "Carlos Mendoza",
                UserName = "cmendoza",
                IdEstatusEmpleado = true
            });
            await db.SaveChangesAsync();

            var service = new ProcesoService(db);
            var request = new CreateProcesoRequest
            {
                ClaveProceso = "PR-CAL-01",
                NombreProceso = "Gestión de Calidad",
                IdEmpleadoResponsable = 5
            };

            // Act
            var result = await service.CreateAsync(request, userId: 10);

            // Assert
            Assert.True(result.Resultado > 0);
            Assert.Equal("Proceso creado exitosamente.", result.Mensaje);
            var saved = await db.Procesos.FindAsync(result.Resultado);
            Assert.NotNull(saved);
            Assert.Equal("PR-CAL-01", saved.ClaveProceso);
            Assert.Equal("Gestión de Calidad", saved.NombreProceso);
            Assert.Equal(5, saved.IdEmpleadoResponsable);
            Assert.Equal(10, saved.IdEmpleadoAlta);
        }

        [Fact]
        public async Task CreateAsync_DuplicateClaveOrNombre_ReturnsError()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            db.Procesos.Add(new Proceso
            {
                IdProceso = 1,
                ClaveProceso = "PR-01",
                NombreProceso = "Compras",
                IdEstatusProceso = true
            });
            await db.SaveChangesAsync();

            var service = new ProcesoService(db);

            // Act
            var result = await service.CreateAsync(new CreateProcesoRequest
            {
                ClaveProceso = "pr-01",
                NombreProceso = "Otro Proceso"
            }, userId: 10);

            // Assert
            Assert.Equal(-1, result.Resultado);
            Assert.Equal("Ya existe un proceso con esa clave o nombre.", result.Mensaje);
        }

        [Fact]
        public async Task UpdateAsync_ValidRequest_UpdatesProceso()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            db.Procesos.Add(new Proceso
            {
                IdProceso = 1,
                ClaveProceso = "PR-02",
                NombreProceso = "Ventas",
                IdEstatusProceso = true
            });
            await db.SaveChangesAsync();

            var service = new ProcesoService(db);

            // Act
            var result = await service.UpdateAsync(1, new UpdateProcesoRequest
            {
                IdProceso = 1,
                ClaveProceso = "PR-02",
                NombreProceso = "Ventas y Comercialización",
                IdEstatusProceso = true
            }, userId: 20);

            // Assert
            Assert.Equal(1, result.Resultado);
            var updated = await db.Procesos.FindAsync(1);
            Assert.NotNull(updated);
            Assert.Equal("Ventas y Comercialización", updated.NombreProceso);
            Assert.Equal(20, updated.IdEmpleadoActualiza);
        }

        [Fact]
        public async Task SubProcesos_CreateAndList_Success()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            db.Procesos.Add(new Proceso
            {
                IdProceso = 1,
                ClaveProceso = "PR-OP-01",
                NombreProceso = "Operaciones",
                IdEstatusProceso = true
            });
            await db.SaveChangesAsync();

            var service = new ProcesoService(db);

            // Act
            var createResult = await service.CreateSubProcesoAsync(new CreateSubProcesoRequest
            {
                IdProceso = 1,
                ClaveSubProceso = "SP-01",
                DescripcionSubProceso = "Mantenimiento Preventivo"
            }, userId: 10);

            var list = await service.GetSubProcesosAsync(1);

            // Assert
            Assert.True(createResult.Resultado > 0);
            Assert.Single(list);
            Assert.Equal("SP-01", list[0].ClaveSubProceso);
            Assert.Equal("Mantenimiento Preventivo", list[0].DescripcionSubProceso);
        }

        [Fact]
        public async Task DeleteAsync_ExistingProceso_DeletesSuccessfully()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            db.Procesos.Add(new Proceso
            {
                IdProceso = 1,
                ClaveProceso = "TEMP",
                NombreProceso = "Temporal",
                IdEstatusProceso = true
            });
            await db.SaveChangesAsync();

            var service = new ProcesoService(db);

            // Act
            var result = await service.DeleteAsync(1, userId: 10);

            // Assert
            Assert.Equal(1, result.Resultado);
            var exists = await db.Procesos.FindAsync(1);
            Assert.Null(exists);
        }
    }
}
