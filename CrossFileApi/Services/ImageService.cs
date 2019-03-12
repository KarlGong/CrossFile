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
                if (original.Width <= maxWidth && original.Height <= maxHeight)
                {
                    var returnStream = new MemoryStream();
                    fileStream.Position = 0;
                    await fileStream.CopyToAsync(returnStream);
                    fileStream.Position = 0;
                    returnStream.Position = 0;
                    return returnStream;
                }

                var width = 0;
                var height = 0;

                if ((original.Width / original.Height) > (maxWidth / maxHeight))
                {
                    width = maxWidth;
                    height = (width * original.Height) / original.Width;
                }
                else
                {
                    height = maxHeight;
                    width = (height * original.Width) / original.Height;
                }

                using (var resized = original.Resize(new SKImageInfo(width, height), SKFilterQuality.High))
                {
                    using (var image = SKImage.FromBitmap(resized))
                    {
                        return image.Encode(SKEncodedImageFormat.Png, 100).AsStream();
                    }
                }
            }
        }
    }
}