using System;
using System.IO;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using CrossFile.Models;
using CrossFile.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;

namespace CrossFile.Controllers
{
    [Route("api/[controller]")]
    public class FileController : Controller
    {
        private readonly IFileService _service;

        public FileController(IFileService service)
        {
            _service = service;
        }

        [HttpGet("{fileName}")]
        public async Task<IActionResult> GetFile([FromRoute] string fileName, [FromQuery] string name)
        {
            new FileExtensionContentTypeProvider().TryGetContentType(fileName, out var mime);

            return new FileStreamResult(await _service.GetFileStreamAsync(fileName), mime ?? "application/octet-stream")
            {
                FileDownloadName = name ?? fileName,
                LastModified = DateTimeOffset.MinValue,
                EnableRangeProcessing = true
            };
        }
    }
}