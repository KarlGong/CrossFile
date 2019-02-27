using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CrossFile.Models;
using CrossFile.Services;
using Microsoft.AspNetCore.Mvc;

namespace CrossFile.Controllers
{
    [Route("api/[controller]")]
    public class ItemController : Controller
    {
        private readonly IItemService _service;

        public ItemController(IItemService service)
        {
            _service = service;
        }

        [HttpGet("{itemId}")]
        public async Task<Item> GetItem([FromRoute] string itemId)
        {
            return await _service.GetItemAsync(itemId);
        }

        [HttpDelete("{itemId}")]
        public async Task DeleteItem([FromRoute] string itemId)
        {
            await _service.DeleteItemAsync(itemId);
        }
    }
}