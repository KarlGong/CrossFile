using System;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using CrossFile.Models;
using CrossFile.Services;
using CrossFile.Services.Parameters;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;

namespace CrossFile.Controllers
{
    [Route("api/[controller]")]
    public class FileController : Controller
    {
        private readonly IItemService _itemService;
        private readonly IFileService _fileService;

        public FileController(IItemService itemService, IFileService fileService)
        {
            _itemService = itemService;
            _fileService = fileService;
        }

        [HttpGet("{fileName}")]
        public async Task<IActionResult> GetFile([FromRoute] string fileName, [FromQuery] string name)
        {
            new FileExtensionContentTypeProvider().TryGetContentType(fileName, out var mime);

            return new FileStreamResult(await _fileService.GetFileStreamAsync(fileName),
                mime ?? "application/octet-stream")
            {
                FileDownloadName = name ?? fileName,
                LastModified = DateTimeOffset.MinValue,
                EnableRangeProcessing = true
            };
        }

        [HttpGet]
        public async Task<IActionResult> GetFileByFilter([FromQuery] string spaceName, [FromQuery] string partialName)
        {
            var items = await _itemService.GetItemsAsync(new GetItemsParams()
            {
                SpaceName = spaceName,
                PartialName = partialName,
                Size = 1
            });

            if (!items.Any()) return NotFound("File does not exist.");

            var item = items[0];

            new FileExtensionContentTypeProvider().TryGetContentType(item.FileName, out var mime);

            return new FileStreamResult(await _fileService.GetFileStreamAsync(item.FileName),
                mime ?? "application/octet-stream")
            {
                FileDownloadName = item.Name,
                LastModified = DateTimeOffset.MinValue,
                EnableRangeProcessing = true
            };
        }
    }
}