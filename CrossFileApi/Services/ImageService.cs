using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Threading.Tasks;
using SkiaSharp;

namespace CrossFile.Services
{
    public interface IImageService
    {
        Task<Stream> ResizeToPng(Stream fileStream, int maxWidth, int maxHeight);
    }

    public class ImageService : IImageService
    {
        public async Task<Stream> ResizeToPng(Stream fileStream, int maxWidth, int maxHeight)
        {
            using (var inputStream = new SKManagedStream(fileStream))
            using (var original = SKBitmap.Decode(inputStream))
            {
                var width = 0.0;
                var height = 0.0;
                
                var originalWidth = (double) original.Width;
                var originalHeight = (double) original.Height;

                var _maxWidth = (double) maxWidth;
                var _maxHeight = (double) maxHeight;
                
                if ((originalWidth / originalHeight) > (_maxWidth / _maxHeight))
                {
                    width = _maxWidth;
                    height = (width * originalHeight) / originalWidth;
                }
                else
                {
                    height = _maxHeight;
                    width = (height * originalWidth) / originalHeight;
                }

                using (var resized = original.Resize(new SKImageInfo((int) Math.Round(width), (int) Math.Round(height)),
                    SKFilterQuality.High))
                {
                    using (var image = SKImage.FromBitmap(resized))
                    {
                        fileStream.Position = 0;
                        return image.Encode(SKEncodedImageFormat.Png, 100).AsStream();
                    }
                }
            }
        }
    }
}