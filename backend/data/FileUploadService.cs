// Services/FileUploadService.cs
using Microsoft.AspNetCore.Hosting;

public class FileUploadService
{
    private readonly IWebHostEnvironment _environment;
    private readonly IConfiguration _configuration;

    public FileUploadService(IWebHostEnvironment environment, IConfiguration configuration)
    {
        _environment = environment;
        _configuration = configuration;
    }

    public async Task<string?> UploadFileAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return null;

        // Create uploads directory if it doesn't exist
        var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads", "wallpapers");
        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        // Generate unique filename
        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var filePath = Path.Combine(uploadsFolder, fileName);

        // Save file
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Return relative URL
        return $"/uploads/wallpapers/{fileName}";
    }

    public void DeleteFile(string fileUrl)
    {
        if (string.IsNullOrEmpty(fileUrl) || !fileUrl.StartsWith("/uploads/"))
            return;

        var filePath = Path.Combine(_environment.WebRootPath, fileUrl.TrimStart('/'));
        if (File.Exists(filePath))
        {
            File.Delete(filePath);
        }
    }
}