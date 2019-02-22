using CrossFile.Models;
using Microsoft.EntityFrameworkCore;

namespace CrossFile.Data
{
    public class CrossFileDbContext : DbContext
    {
        public CrossFileDbContext(DbContextOptions<CrossFileDbContext> options) : base(options)
        {
        }

        public DbSet<Item> Items { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new ItemConfiguration());
        }
    }
}