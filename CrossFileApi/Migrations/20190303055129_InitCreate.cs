using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CrossFile.Migrations
{
    public partial class InitCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Items",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    SpaceName = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    Size = table.Column<long>(nullable: false),
                    FileName = table.Column<string>(nullable: true),
                    InsertTime = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Items", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Items_InsertTime",
                table: "Items",
                column: "InsertTime");

            migrationBuilder.CreateIndex(
                name: "IX_Items_SpaceName",
                table: "Items",
                column: "SpaceName");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Items");
        }
    }
}
