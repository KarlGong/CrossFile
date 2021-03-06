using System.IO;

namespace CrossFile.Services.Parameters
{
    public class AddItemParams
    {
        public string SpaceName { get; set; }
        
        public string Name { get; set; }
        
        public string Extension { get; set; }
        
        public Stream FileStream { get; set; }
    }
}