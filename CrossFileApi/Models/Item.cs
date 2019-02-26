using System;

namespace CrossFile.Models
{
    public class Item
    {
        public int Id { get; set; }
        
        public string SpaceName { get; set; }

        public string Name { get; set; }
        
        public long Size { get; set; }
        
        public string FileName { get; set; }
        
        public DateTime InsertTime { get; set; }

        public DateTime UpdateTime { get; set; }
    }
}