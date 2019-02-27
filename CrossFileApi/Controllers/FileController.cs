using System.IO;
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
        public async Task<IActionResult> GetFile([FromRoute] string fileName)
        {
            new FileExtensionContentTypeProvider().TryGetContentType(fileName, out var mime);

            return File(await _service.GetFileStreamAsync(fileName), mime ?? "application/octet-stream", fileName, true);
        }
    }
}