using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CrossFile.Data;
using CrossFile.Models;
using CrossFile.Services.Parameters;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace CrossFile.Services
{
    public interface IItemService
    {
        Task<Item> GetItemAsync(String itemId);

        Task<List<Item>> GetItemsAsync(GetItemsParams ps);

        Task<Item> AddItemAsync(AddItemParams ps);

        Task DeleteItemAsync(String itemId);
    }

    public class ItemService : IItemService
    {
        private readonly CrossFileDbContext _context;
        private readonly IFileService _fileService;
        private readonly IMapper _mapper;

        public ItemService(CrossFileDbContext context, IFileService fileService, IMapper mapper)
        {
            _context = context;
            _fileService = fileService;
            _mapper = mapper;
        }

        public async Task<Item> GetItemAsync(string itemId)
        {
            return await _context.Items.SingleAsync(i => i.Id == itemId);
        }

        public async Task<List<Item>> GetItemsAsync(GetItemsParams ps)
        {
            var queryable = _context.Items.Where(i => i.SpaceName == ps.SpaceName);

            if (ps.FromId != null)
            {
                var item = await _context.Items.SingleAsync(i => i.Id == ps.FromId);
                queryable = queryable.Where(i => i.InsertTime < item.InsertTime);
            }

            return await queryable.OrderByDescending(i => i.InsertTime).Take(ps.Size).ToListAsync();
        }

        public async Task<Item> AddItemAsync(AddItemParams ps)
        {
            var itemId = Guid.NewGuid().ToString();
            var fileName = itemId + ps.FileExt;

            await _fileService.SaveFileAsync(fileName, ps.FileStream);

            var newItem = new Item()
            {
                Id = itemId,
                SpaceName = ps.SpaceName,
                Name = ps.Name,
                Size = ps.FileStream.Length,
                FileName = fileName,
                InsertTime = DateTime.UtcNow
            };

            await _context.Items.AddAsync(newItem);

            await _context.SaveChangesAsync();

            return newItem;
        }

        public async Task DeleteItemAsync(string itemId)
        {
            var item = await _context.Items.SingleAsync(i => i.Id == itemId);

            await _fileService.DeleteFileAsync(item.FileName);

            _context.Items.Remove(item);

            await _context.SaveChangesAsync();
        }
    }
}