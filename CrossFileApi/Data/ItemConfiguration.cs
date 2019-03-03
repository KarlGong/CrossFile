using CrossFile.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CrossFile.Data
{
    public class ItemConfiguration : IEntityTypeConfiguration<Item>
    {
        public void Configure(EntityTypeBuilder<Item> builder)
        {
            builder.HasKey(i => i.Id);

            builder.HasIndex(i => i.SpaceName);

            builder.HasIndex(i => i.InsertTime);
        }
    }
}