using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class CreateSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Settings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SiteName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SiteDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AllowedFileTypes = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MaxUploadSize = table.Column<int>(type: "int", nullable: false),
                    DefaultLanguage = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DefaultCategory = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AutoApproveUploads = table.Column<bool>(type: "bit", nullable: false),
                    EnableUserUploads = table.Column<bool>(type: "bit", nullable: false),
                    PasswordPolicy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Enable2FA = table.Column<bool>(type: "bit", nullable: false),
                    DefaultTheme = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DefaultLayout = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CategoryColor = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SessionTimeout = table.Column<int>(type: "int", nullable: false),
                    MaintenanceMode = table.Column<bool>(type: "bit", nullable: false),
                    IpWhitelist = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SiteLogoUrl = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Settings", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Settings");
        }
    }
}
