using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoryNavigation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Wallpapers");

            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "Wallpapers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Wallpapers_CategoryId",
                table: "Wallpapers",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Wallpapers_Categories_CategoryId",
                table: "Wallpapers",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Wallpapers_Categories_CategoryId",
                table: "Wallpapers");

            migrationBuilder.DropIndex(
                name: "IX_Wallpapers_CategoryId",
                table: "Wallpapers");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Wallpapers");

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Wallpapers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
