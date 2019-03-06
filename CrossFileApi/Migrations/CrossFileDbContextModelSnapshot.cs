﻿// <auto-generated />
using System;
using CrossFile.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace CrossFile.Migrations
{
    [DbContext(typeof(CrossFileDbContext))]
    partial class CrossFileDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.2-servicing-10034");

            modelBuilder.Entity("CrossFile.Models.Item", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("FileName");

                    b.Property<DateTimeOffset>("InsertTime");

                    b.Property<string>("Name");

                    b.Property<long>("Size");

                    b.Property<string>("SpaceName");

                    b.HasKey("Id");

                    b.HasIndex("InsertTime");

                    b.HasIndex("SpaceName");

                    b.ToTable("Items");
                });
#pragma warning restore 612, 618
        }
    }
}
