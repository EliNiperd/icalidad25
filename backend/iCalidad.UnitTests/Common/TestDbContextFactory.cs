using Microsoft.EntityFrameworkCore;
using iCalidad.Infrastructure.Persistence;

namespace iCalidad.UnitTests.Common
{
    public static class TestDbContextFactory
    {
        public static ApplicationDbContext CreateInMemoryContext(string dbName)
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: dbName)
                .Options;

            return new ApplicationDbContext(options);
        }
    }
}
