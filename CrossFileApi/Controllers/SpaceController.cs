using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CrossFile.Models;
using CrossFile.Services;
using CrossFile.Services.Parameters;
using Microsoft.AspNetCore.Mvc;

namespace CrossFile.Controllers
{
    [Route("api/[controller]")]
    public class SpaceController : Controller
    {
        private readonly IItemService _service;
        private readonly IMapper _mapper;
        
        public SpaceController(IItemService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet("{spaceName}")]
        public async Task<IEnumerable<Item>> GetItems([FromRoute] string spaceName, [FromQuery] string fromId, [FromQuery] int size)
        {
            return await _service.GetItemsAsync(new GetItemsParams()
            {
                SpaceName = spaceName,
                FromId = fromId,
                Size = size
            });
        }

        [HttpPost("{spaceName}")]
        [RequestSizeLimit(2_147_483_648)]
        public async Task<Item> AddItem([FromRoute] string spaceName)
        {
            var formFile = Request.Form.Files[0];
            var fileExt = Path.GetExtension(formFile.FileName);

            using (var fileStream = formFile.OpenReadStream())
            {
                return await _service.AddItemAsync(new AddItemParams()
                {
                    Name = formFile.Name,
                    Extension = fileExt,
                    SpaceName = spaceName,
                    FileStream = fileStream
                });
            }
        }
    }
}