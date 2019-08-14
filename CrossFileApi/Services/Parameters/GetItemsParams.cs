namespace CrossFile.Services.Parameters
{
    public class GetItemsParams
    {
        public string SpaceName { get; set; }
        
        public string PartialName { get; set; }
        
        public string FromId { get; set; }
        
        public int Size { get; set; }
    }
}