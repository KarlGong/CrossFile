using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace CrossFile.Services
{
    public interface IFileService
    {
        Task<Stream> GetFileStreamAsync(string fileName);

        Task SaveFileAsync(string fileName, Stream fileStream);

        Task DeleteFileAsync(string fileName);
    }


    public class FileService : IFileService
    {
        private readonly IConfiguration _configuration;
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly string _storeDirectory;

        public FileService(IConfiguration configuration, IHostingEnvironment hostingEnvironment)
        {
            _configuration = configuration;
            _hostingEnvironment = hostingEnvironment;
            _storeDirectory = Path.Combine(_hostingEnvironment.ContentRootPath, _configuration["StoreDirectory"]);
        }

        public async Task<Stream> GetFileStreamAsync(string fileName)
        {
            var filePath = Path.Combine(_storeDirectory, fileName);

            return new FileStream(filePath, FileMode.Open, FileAccess.Read);
        }

        public async Task SaveFileAsync(string fileName, Stream fileStream)
        {
            if (!Directory.Exists(_storeDirectory))
            {
                Directory.CreateDirectory(_storeDirectory);
            }

            var filePath = Path.Combine(_storeDirectory, fileName);

            using (var fs = new FileStream(filePath, FileMode.CreateNew, FileAccess.ReadWrite))
            {
                await fileStream.CopyToAsync(fs);
            }
        }

        public async Task DeleteFileAsync(string fileName)
        {
            var filePath = Path.Combine(_storeDirectory, fileName);

            File.Delete(filePath);
        }
    }
}