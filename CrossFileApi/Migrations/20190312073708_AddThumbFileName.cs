using Microsoft.EntityFrameworkCore.Migrations;

namespace CrossFile.Migrations
{
    public partial class AddThumbFileName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ThumbFileName",
                table: "Items",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ThumbFileName",
                table: "Items");
        }
    }
}
