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
        Task<Item> GetItemAsync(string itemId);

        Task<Item> GetItemByNameAsync(string name);

        Task<List<Item>> GetItemsAsync(GetItemsParams ps);

        Task<Item> AddItemAsync(AddItemParams ps);

        Task DeleteItemAsync(string itemId);
    }

    public class ItemService : IItemService
    {
        private readonly CrossFileDbContext _context;
        private readonly IFileService _fileService;
        private readonly IImageService _imageService;
        private readonly IMapper _mapper;

        public ItemService(CrossFileDbContext context, IFileService fileService, IImageService imageService,
            IMapper mapper)
        {
            _context = context;
            _fileService = fileService;
            _imageService = imageService;
            _mapper = mapper;
        }

        public async Task<Item> GetItemAsync(string itemId)
        {
            return await _context.Items.SingleOrDefaultAsync(i => i.Id == itemId);
        }

        public async Task<Item> GetItemByNameAsync(string name)
        {
            return await _context.Items.Where(i => i.FileName == name).FirstOrDefaultAsync();
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
            
            string thumbFileName = null;

            if (new[] {".jpg", ".jpeg", ".gif", ".png"}.Contains(ps.FileExt, StringComparer.OrdinalIgnoreCase))
            {
                using (var thumbStream = await _imageService.ResizeToPng(ps.FileStream, 128, 128))
                {
                    thumbFileName = itemId + "-thumb.png";
                    await _fileService.SaveFileAsync(thumbFileName, thumbStream);
                }
            }

            var newItem = new Item()
            {
                Id = itemId,
                SpaceName = ps.SpaceName,
                Name = ps.Name,
                Size = ps.FileStream.Length,
                FileName = fileName,
                ThumbFileName = thumbFileName,
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

            if (item.ThumbFileName != null)
            {
                await _fileService.DeleteFileAsync(item.ThumbFileName);
            }

            _context.Items.Remove(item);

            await _context.SaveChangesAsync();
        }
    }
}