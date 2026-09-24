using iCalidad.Application.Services;
using iCalidad.Domain.Entities;
using iCalidad.UnitTests.Common;

namespace iCalidad.UnitTests.Services
{
    public class MenuServiceTests
    {
        [Fact]
        public async Task GetMenuByEmployeeAsync_UserWithoutRoles_ReturnsEmptyList()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            var service = new MenuService(db);

            // Act
            var result = await service.GetMenuByEmployeeAsync(999);

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        [Fact]
        public async Task GetMenuByEmployeeAsync_UserWithRoles_ReturnsActiveMenusOrdered()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            var roleId = 1;
            var empId = 10;

            db.EmpleadosRoles.Add(new EmpleadoRol { IdEmpleado = empId, IdRol = roleId });

            db.Menus.AddRange(
                new Menu { IdMenu = 1, IdRol = roleId, NombreMenu = "Dashboard", Url = "/icalidad/dashboard", OrdenMenu = 1, IdEstatusMenu = 1 },
                new Menu { IdMenu = 2, IdRol = roleId, NombreMenu = "Gerencias", Url = "/icalidad/gerencia", OrdenMenu = 2, IdEstatusMenu = 1 },
                new Menu { IdMenu = 3, IdRol = roleId, NombreMenu = "Inactivo", Url = "/icalidad/inactivo", OrdenMenu = 3, IdEstatusMenu = 0 } // Inactivo
            );
            await db.SaveChangesAsync();

            var service = new MenuService(db);

            // Act
            var result = await service.GetMenuByEmployeeAsync(empId);

            // Assert
            Assert.Equal(2, result.Count);
            Assert.Equal("Dashboard", result[0].Nombre);
            Assert.Equal("Gerencias", result[1].Nombre);
        }

        [Fact]
        public async Task GetMenuByEmployeeAsync_MultipleRolesSameMenu_DeduplicatesMenus()
        {
            // Arrange
            var db = TestDbContextFactory.CreateInMemoryContext(Guid.NewGuid().ToString());
            var empId = 20;

            db.EmpleadosRoles.AddRange(
                new EmpleadoRol { IdEmpleado = empId, IdRol = 1 },
                new EmpleadoRol { IdEmpleado = empId, IdRol = 2 }
            );

            // En la base de datos cada fila de Gen_TMenu tiene su propio IdMenu PK, pudiendo compartir nombre o ruta
            db.Menus.AddRange(
                new Menu { IdMenu = 101, IdRol = 1, NombreMenu = "Gerencias", Url = "/icalidad/gerencia", OrdenMenu = 1, IdEstatusMenu = 1 },
                new Menu { IdMenu = 102, IdRol = 2, NombreMenu = "Departamentos", Url = "/icalidad/departamento", OrdenMenu = 2, IdEstatusMenu = 1 }
            );
            await db.SaveChangesAsync();

            var service = new MenuService(db);

            // Act
            var result = await service.GetMenuByEmployeeAsync(empId);

            // Assert
            Assert.Equal(2, result.Count);
            Assert.Contains(result, m => m.Nombre == "Gerencias");
            Assert.Contains(result, m => m.Nombre == "Departamentos");
        }
    }
}
