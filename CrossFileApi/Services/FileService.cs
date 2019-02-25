using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace CrossFile.Services
{
    public interface IFileService
    {
        Task<Stream> GetFileStreamAsync(string fileName);

        Task SaveFileAsync(string fileName, Stream fileStream);
    }


    public class FileService : IFileService
    {
        private readonly IConfiguration _configuration;

        public FileService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<Stream> GetFileStreamAsync(string fileName)
        {
            var storeFolder = _configuration["StoreLocation"];

            var filePath = Path.Combine(storeFolder, fileName);

            return await Task.FromResult(new FileStream(filePath, FileMode.Open));
        }

        public async Task SaveFileAsync(string fileName, Stream fileStream)
        {
            var storeFolder = _configuration["StoreLocation"];

            if (!Directory.Exists(storeFolder))
            {
                Directory.CreateDirectory(storeFolder);
            }

            var filePath = Path.Combine(storeFolder, fileName);

            using (var fs = new FileStream(filePath, FileMode.CreateNew, FileAccess.ReadWrite))
            {
                await fileStream.CopyToAsync(fs);
            }
        }
    }
}