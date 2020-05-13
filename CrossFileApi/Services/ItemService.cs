using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CrossFile.Data;
using CrossFile.Exceptions;
using CrossFile.Models;
using CrossFile.Services.Parameters;
using Microsoft.EntityFrameworkCore;

namespace CrossFile.Services
{
    public interface IItemService
    {
        Task<Item> GetItemAsync(string itemId);

        Task<List<Item>> GetItemsAsync(GetItemsParams ps);

        Task<Item> AddItemAsync(AddItemParams ps);

        Task<Item> UpdateItemAsync(string itemId, UpdateItemParams ps);

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
            var item = await _context.Items.SingleOrDefaultAsync(i => i.Id == itemId);
            if (item == null) throw new NotFoundException($"Item {itemId} does not exist.");
            return item;
        }

        public async Task<List<Item>> GetItemsAsync(GetItemsParams ps)
        {
            IQueryable<Item> queryable = _context.Items;

            if (ps.SpaceName != null)
            {
                queryable = queryable.Where(i => i.SpaceName == ps.SpaceName);
            }

            if (ps.PartialName != null)
            {
                queryable = queryable.Where(i => i.Name.Contains(ps.PartialName));
            }

            if (ps.FromId != null)
            {
                var item = await _context.Items.SingleAsync(i => i.Id == ps.FromId);
                queryable = queryable.Where(i => i.InsertTime < item.InsertTime);
            }

            queryable = queryable.OrderByDescending(i => i.InsertTime);

            if (ps.Size != null)
            {
                queryable = queryable.Take(ps.Size.Value);
            }

            return await queryable.ToListAsync();
        }

        public async Task<Item> AddItemAsync(AddItemParams ps)
        {
            var itemId = Guid.NewGuid().ToString();
            var fileName = itemId + ps.Extension;

            await _fileService.SaveFileAsync(fileName, ps.FileStream);

            string thumbFileName = null;

            if (new[] {".jpg", ".jpeg", ".gif", ".png"}.Contains(ps.Extension, StringComparer.OrdinalIgnoreCase))
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
                Extension = ps.Extension.ToLower(),
                FileName = fileName,
                ThumbFileName = thumbFileName,
                InsertTime = DateTimeOffset.UtcNow,
                UpdateTime = DateTimeOffset.UtcNow
            };

            await _context.Items.AddAsync(newItem);
            await _context.SaveChangesAsync();
            return newItem;
        }

        public async Task<Item> UpdateItemAsync(string itemId, UpdateItemParams ps)
        {
            var item = await GetItemAsync(itemId);
            _mapper.Map(ps, item);
            item.UpdateTime = DateTimeOffset.UtcNow;
            await _context.SaveChangesAsync();
            return item;
        }

        public async Task DeleteItemAsync(string itemId)
        {
            var item = await GetItemAsync(itemId);
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