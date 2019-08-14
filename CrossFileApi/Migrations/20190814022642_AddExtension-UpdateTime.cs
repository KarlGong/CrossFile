using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CrossFile.Migrations
{
    public partial class AddExtensionUpdateTime : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Extension",
                table: "Items",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "UpdateTime",
                table: "Items",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Extension",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "UpdateTime",
                table: "Items");
        }
    }
}
