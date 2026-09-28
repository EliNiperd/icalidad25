using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using iCalidad.Application.DTOs;
using iCalidad.Application.Services;
using iCalidad.Domain.Entities;
using iCalidad.UnitTests.Common;

namespace iCalidad.UnitTests.Services
{
    public class EmpleadoServiceTests
    {
        [Fact]
        public async Task CreateAsync_ValidRequestWithPuestosAndRoles_CreatesSuccessfully()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            db.Puestos.Add(new Puesto { IdPuesto = 1, NombrePuesto = "Ingeniero de Software", IdEstatusPuesto = true });
            db.Puestos.Add(new Puesto { IdPuesto = 2, NombrePuesto = "Líder Técnico", IdEstatusPuesto = true });
            db.Roles.Add(new Rol { IdRol = 1, NombreRol = "Administrador" });
            db.Roles.Add(new Rol { IdRol = 2, NombreRol = "Auditor" });
            await db.SaveChangesAsync();

            var service = new EmpleadoService(db);
            var request = new CreateEmpleadoRequest
            {
                NombreEmpleado = "Juan Perez",
                UserName = "jperez",
                Password = "SecretPassword123",
                Correo = "jperez@test.com",
                IdEstatusEmpleado = true,
                IdPuestos = new List<int> { 1, 2 },
                IdRoles = new List<int> { 1, 2 }
            };

            // Act
            var result = await service.CreateAsync(request, userId: 99);

            // Assert
            Assert.True(result.Resultado > 0);
            var saved = await db.Empleados.FindAsync(result.Resultado);
            Assert.NotNull(saved);
            Assert.Equal("Juan Perez", saved.NombreEmpleado);
            Assert.Equal("jperez", saved.UserName);
            Assert.Equal(99, saved.IdEmpleadoAlta);

            var puestos = db.EmpleadosPuestos.Where(ep => ep.IdEmpleado == result.Resultado).ToList();
            Assert.Equal(2, puestos.Count);

            var roles = db.EmpleadosRoles.Where(er => er.IdEmpleado == result.Resultado).ToList();
            Assert.Equal(2, roles.Count);
        }

        [Fact]
        public async Task CreateAsync_DuplicateUserName_ReturnsError()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            db.Empleados.Add(new Empleado
            {
                IdEmpleado = 1,
                NombreEmpleado = "Carlos Lopez",
                UserName = "clopez",
                Password = "123",
                IdEstatusEmpleado = true
            });
            await db.SaveChangesAsync();

            var service = new EmpleadoService(db);
            var request = new CreateEmpleadoRequest
            {
                NombreEmpleado = "Otro Carlos",
                UserName = "clopez",
                Password = "456"
            };

            // Act
            var result = await service.CreateAsync(request, userId: 1);

            // Assert
            Assert.Equal(-1, result.Resultado);
            Assert.Contains("Ya existe un empleado con ese nombre de usuario", result.Mensaje);
        }

        [Fact]
        public async Task UpdateAsync_UpdatesDataAndSynchronizesPuestosAndRoles()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            var emp = new Empleado
            {
                IdEmpleado = 1,
                NombreEmpleado = "Mario Gomez",
                UserName = "mgomez",
                Password = "pwd",
                IdEstatusEmpleado = true
            };
            emp.EmpleadosPuestos.Add(new EmpleadoPuesto { IdEmpleado = 1, IdPuesto = 10 });
            emp.EmpleadosPuestos.Add(new EmpleadoPuesto { IdEmpleado = 1, IdPuesto = 20 });
            emp.EmpleadosRoles.Add(new EmpleadoRol { IdEmpleado = 1, IdRol = 1 });

            db.Empleados.Add(emp);
            await db.SaveChangesAsync();

            var service = new EmpleadoService(db);
            var updateRequest = new UpdateEmpleadoRequest
            {
                IdEmpleado = 1,
                NombreEmpleado = "Mario Gomez Modificado",
                UserName = "mgomez",
                IdEstatusEmpleado = true,
                // Conserva puesto 10, remueve puesto 20, agrega puesto 30
                IdPuestos = new List<int> { 10, 30 },
                // Conserva rol 1, agrega rol 2
                IdRoles = new List<int> { 1, 2 }
            };

            // Act
            var result = await service.UpdateAsync(1, updateRequest, userId: 88);

            // Assert
            Assert.Equal(1, result.Resultado);
            var updated = await db.Empleados.FindAsync(1);
            Assert.NotNull(updated);
            Assert.Equal("Mario Gomez Modificado", updated.NombreEmpleado);
            Assert.Equal(88, updated.IdEmpleadoActualiza);

            var puestos = db.EmpleadosPuestos.Where(ep => ep.IdEmpleado == 1).Select(ep => ep.IdPuesto).OrderBy(x => x).ToList();
            Assert.Equal(new List<int> { 10, 30 }, puestos);

            var roles = db.EmpleadosRoles.Where(er => er.IdEmpleado == 1).Select(er => er.IdRol).OrderBy(x => x).ToList();
            Assert.Equal(new List<int> { 1, 2 }, roles);
        }

        [Fact]
        public async Task GetPuestosByEmpleadoAsync_ReturnsAssignedPuestos()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            var puesto = new Puesto { IdPuesto = 5, NombrePuesto = "Auditor de Calidad" };
            db.Puestos.Add(puesto);
            var emp = new Empleado { IdEmpleado = 10, NombreEmpleado = "Ana Soto", UserName = "asoto", Password = "123" };
            emp.EmpleadosPuestos.Add(new EmpleadoPuesto { IdEmpleado = 10, IdPuesto = 5, Puesto = puesto });
            db.Empleados.Add(emp);
            await db.SaveChangesAsync();

            var service = new EmpleadoService(db);

            // Act
            var puestos = await service.GetPuestosByEmpleadoAsync(10);

            // Assert
            Assert.Single(puestos);
            Assert.Equal(5, puestos[0].IdPuesto);
            Assert.Equal("Auditor de Calidad", puestos[0].NombrePuesto);
        }

        [Fact]
        public async Task GetRolesByEmpleadoAsync_ReturnsAssignedRoles()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            var rol = new Rol { IdRol = 3, NombreRol = "Operador" };
            db.Roles.Add(rol);
            var emp = new Empleado { IdEmpleado = 15, NombreEmpleado = "Luis Mena", UserName = "lmena", Password = "123" };
            emp.EmpleadosRoles.Add(new EmpleadoRol { IdEmpleado = 15, IdRol = 3, Rol = rol });
            db.Empleados.Add(emp);
            await db.SaveChangesAsync();

            var service = new EmpleadoService(db);

            // Act
            var roles = await service.GetRolesByEmpleadoAsync(15);

            // Assert
            Assert.Single(roles);
            Assert.Equal(3, roles[0].IdRol);
            Assert.Equal("Operador", roles[0].NombreRol);
        }

        [Fact]
        public async Task DeleteAsync_ExistingEmpleado_DeletesSuccessfully()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            var emp = new Empleado { IdEmpleado = 50, NombreEmpleado = "Para Borrar", UserName = "borrar", Password = "123" };
            emp.EmpleadosPuestos.Add(new EmpleadoPuesto { IdEmpleado = 50, IdPuesto = 1 });
            emp.EmpleadosRoles.Add(new EmpleadoRol { IdEmpleado = 50, IdRol = 1 });
            db.Empleados.Add(emp);
            await db.SaveChangesAsync();

            var service = new EmpleadoService(db);

            // Act
            var result = await service.DeleteAsync(50, userId: 1);

            // Assert
            Assert.Equal(1, result.Resultado);
            var exists = await db.Empleados.FindAsync(50);
            Assert.Null(exists);
            Assert.Empty(db.EmpleadosPuestos.Where(ep => ep.IdEmpleado == 50));
            Assert.Empty(db.EmpleadosRoles.Where(er => er.IdEmpleado == 50));
        }
    }
}
