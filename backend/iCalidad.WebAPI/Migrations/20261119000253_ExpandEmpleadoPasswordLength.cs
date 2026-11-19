using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace iCalidad.WebAPI.Migrations
{
    /// <inheritdoc />
    public partial class ExpandEmpleadoPasswordLength : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                "ALTER TABLE [Gen_TEmpleado] ALTER COLUMN [Password] NVARCHAR(255) NOT NULL;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                "ALTER TABLE [Gen_TEmpleado] ALTER COLUMN [Password] NVARCHAR(20) NOT NULL;");
        }
    }
}
