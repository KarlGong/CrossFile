using System;

namespace CrossFile.Exceptions
{
    public class NotFoundException: CrossFileException
    {
        public NotFoundException(string message): base(message)
        {
            
        }
    }
}