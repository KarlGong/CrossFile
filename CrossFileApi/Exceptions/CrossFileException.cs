using System;

namespace CrossFile.Exceptions
{
    public class CrossFileException: Exception
    {
        public CrossFileException(string message) : base(message)
        {
            
        }
    }
}