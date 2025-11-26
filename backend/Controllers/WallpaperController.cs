using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/wallpapers")]
    public class WallpaperController : ControllerBase
    {
        private readonly DataService _dataService;
        private readonly FileUploadService _fileUploadService;

        public WallpaperController(DataService dataService, FileUploadService fileUploadService)
        {
            _dataService = dataService;
            _fileUploadService = fileUploadService;
        }

        // GET /api/wallpapers
        [HttpGet]
        public async Task<IActionResult> GetWallpapers()
        {
            var wallpapers = await _dataService.GetWallpapersAsync();
            
            // Convert relative URLs to absolute URLs by creating new objects
            var wallpapersWithAbsoluteUrls = wallpapers.Select(w =>
            {
                var wallpaperObj = w as dynamic;
                string imageUrl = wallpaperObj.imageUrl;
                string fullImageUrl = imageUrl;
                
                if (imageUrl.StartsWith("/uploads/"))
                {
                    var request = HttpContext.Request;
                    fullImageUrl = $"{request.Scheme}://{request.Host}{imageUrl}";
                }
                
                // Create new anonymous object with updated URL
                return new
                {
                    id = wallpaperObj.id,
                    title = wallpaperObj.title,
                    description = wallpaperObj.description,
                    imageUrl = fullImageUrl,
                    category = wallpaperObj.category,
                    downloads = wallpaperObj.downloads,
                    likes = wallpaperObj.likes,
                    createdAt = wallpaperObj.createdAt
                };
            });
            
            return Ok(wallpapersWithAbsoluteUrls);
        }

        // GET /api/wallpapers/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetWallpaperById(int id)
        {
            var wallpaper = await _dataService.GetWallpaperByIdAsync(id);
            if (wallpaper == null) return NotFound();

            // Build full URL for the image
            string fullImageUrl = wallpaper.ImageUrl;
            if (wallpaper.ImageUrl.StartsWith("/uploads/"))
            {
                var request = HttpContext.Request;
                fullImageUrl = $"{request.Scheme}://{request.Host}{wallpaper.ImageUrl}";
            }

            return Ok(new
            {
                id = wallpaper.Id,
                title = wallpaper.Title,
                description = wallpaper.Description,
                imageUrl = fullImageUrl,
                category = wallpaper.Category.Name,
                downloads = wallpaper.Downloads,
    likes = wallpaper.LikedBy // send the array of emails
            });
        }

        // GET /api/wallpapers/category/{category}
        [HttpGet("category/{category}")]
        public async Task<IActionResult> GetWallpapersByCategory(string category)
        {
            var wallpapers = await _dataService.GetWallpapersByCategoryAsync(category);
            
            // Convert relative URLs to absolute URLs by creating new objects
            var wallpapersWithAbsoluteUrls = wallpapers.Select(w =>
            {
                var wallpaperObj = w as dynamic;
                string imageUrl = wallpaperObj.imageUrl;
                string fullImageUrl = imageUrl;
                
                if (imageUrl.StartsWith("/uploads/"))
                {
                    var request = HttpContext.Request;
                    fullImageUrl = $"{request.Scheme}://{request.Host}{imageUrl}";
                }
                
                // Create new anonymous object with updated URL
                return new
                {
                    id = wallpaperObj.id,
                    title = wallpaperObj.title,
                    description = wallpaperObj.description,
                    imageUrl = fullImageUrl,
                    category = wallpaperObj.category
                };
            });
            
            return Ok(wallpapersWithAbsoluteUrls);
        }

        // GET /api/wallpapers/search?q=...
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string q)
        {
            var wallpapers = await _dataService.SearchWallpapersAsync(q);
            var result = wallpapers.Select(w => 
            {
                // Build full URL for the image
                string fullImageUrl = w.ImageUrl;
                if (w.ImageUrl.StartsWith("/uploads/"))
                {
                    var request = HttpContext.Request;
                    fullImageUrl = $"{request.Scheme}://{request.Host}{w.ImageUrl}";
                }

                return new
                {
                    id = w.Id,
                    title = w.Title,
                    description = w.Description,
                    imageUrl = fullImageUrl,
                    category = w.Category.Name,
                        likes = w.LikedBy // add this

                };
            });

            return Ok(result);
        }

        // POST /api/wallpapers
        // [HttpPost]
        // public async Task<IActionResult> AddWallpaper([FromForm] WallpaperCreateDto wallpaperDto)
        // {
        //     if (!ModelState.IsValid)
        //         return BadRequest(ModelState);

        //     // Handle file upload
        //     string imageUrl = wallpaperDto.ImageUrl;

        //     if (wallpaperDto.ImageFile != null && wallpaperDto.ImageFile.Length > 0)
        //     {
        //         var uploadedUrl = await _fileUploadService.UploadFileAsync(wallpaperDto.ImageFile);
        //         if (uploadedUrl != null)
        //         {
        //             imageUrl = uploadedUrl;
        //         }
        //     }

        //     if (string.IsNullOrEmpty(imageUrl))
        //     {
        //         return BadRequest("Either ImageFile or ImageUrl must be provided");
        //     }

        //     var wallpaper = new Wallpaper
        //     {
        //         Title = wallpaperDto.Title,
        //         Description = wallpaperDto.Description,
        //         ImageUrl = imageUrl,
        //         CategoryId = wallpaperDto.CategoryId,
        //         CreatedAt = DateTime.UtcNow
        //     };

        //     var created = await _dataService.AddWallpaperAsync(wallpaper);
            
        //     // Build full URL for the image
        //     string fullImageUrl = created.ImageUrl;
        //     if (created.ImageUrl.StartsWith("/uploads/"))
        //     {
        //         var request = HttpContext.Request;
        //         fullImageUrl = $"{request.Scheme}://{request.Host}{created.ImageUrl}";
        //     }

        //     // Return the created wallpaper with full URL
        //     return Ok(new
        //     {
        //         id = created.Id,
        //         title = created.Title,
        //         description = created.Description,
        //         imageUrl = fullImageUrl,
        //         category = created.Category?.Name
        //     });
        // }
// In WallpaperController - Update the AddWallpaper method
[HttpPost]
public async Task<IActionResult> AddWallpaper([FromForm] WallpaperCreateDto wallpaperDto)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }

    // Handle file upload - prioritize file over URL
    string imageUrl = null;

    if (wallpaperDto.ImageFile != null && wallpaperDto.ImageFile.Length > 0)
    {
        Console.WriteLine($"File received: {wallpaperDto.ImageFile.FileName}, Size: {wallpaperDto.ImageFile.Length}");
        var uploadedUrl = await _fileUploadService.UploadFileAsync(wallpaperDto.ImageFile);
        if (uploadedUrl != null)
        {
            imageUrl = uploadedUrl;
            Console.WriteLine($"File uploaded successfully: {imageUrl}");
        }
    }
    
    // If no file was uploaded or file upload failed, use the URL
    if (string.IsNullOrEmpty(imageUrl) && !string.IsNullOrEmpty(wallpaperDto.ImageUrl))
    {
        imageUrl = wallpaperDto.ImageUrl;
        Console.WriteLine($"Using provided URL: {imageUrl}");
    }

    if (string.IsNullOrEmpty(imageUrl))
    {
        return BadRequest("Either ImageFile or ImageUrl must be provided");
    }

    var wallpaper = new Wallpaper
    {
        Title = wallpaperDto.Title,
        Description = wallpaperDto.Description ?? string.Empty,
        ImageUrl = imageUrl,
        CategoryId = wallpaperDto.CategoryId,
        CreatedAt = DateTime.UtcNow
    };

    var created = await _dataService.AddWallpaperAsync(wallpaper);
    
    // Build full URL for the image
    string fullImageUrl = created.ImageUrl;
    if (created.ImageUrl.StartsWith("/uploads/"))
    {
        var request = HttpContext.Request;
        fullImageUrl = $"{request.Scheme}://{request.Host}{created.ImageUrl}";
    }

    // Return the created wallpaper with full URL
    return Ok(new
    {
        id = created.Id,
        title = created.Title,
        description = created.Description,
        imageUrl = fullImageUrl,
        category = created.Category?.Name
    });
}
        // PUT /api/wallpapers/{id}
     // PUT /api/wallpapers/{id}
[HttpPut("{id:int}")]
public async Task<IActionResult> UpdateWallpaper(int id, [FromForm] WallpaperUpdateDto wallpaperDto)
{
    try
    {
        Console.WriteLine($"=== UPDATE REQUEST RECEIVED ===");
        Console.WriteLine($"Wallpaper ID: {id}");
        Console.WriteLine($"Title: {wallpaperDto.Title}");
        Console.WriteLine($"Description: {wallpaperDto.Description}");
        Console.WriteLine($"CategoryId: {wallpaperDto.CategoryId}");
        Console.WriteLine($"ImageUrl: {wallpaperDto.ImageUrl}");
        Console.WriteLine($"ImageFile: {(wallpaperDto.ImageFile != null ? "Provided" : "Null")}");
        
        var existingWallpaper = await _dataService.GetWallpaperByIdAsync(id);
        if (existingWallpaper == null)
        {
            Console.WriteLine($"Wallpaper with ID {id} not found");
            return NotFound();
        }

        Console.WriteLine($"Existing wallpaper - Title: {existingWallpaper.Title}, Category: {existingWallpaper.CategoryId}");

        // Handle file upload
        string imageUrl = existingWallpaper.ImageUrl; // Keep existing by default

        if (wallpaperDto.ImageFile != null && wallpaperDto.ImageFile.Length > 0)
        {
            // Delete old file if it was an uploaded file
            if (!string.IsNullOrEmpty(existingWallpaper.ImageUrl) && 
                existingWallpaper.ImageUrl.StartsWith("/uploads/"))
            {
                _fileUploadService.DeleteFile(existingWallpaper.ImageUrl);
            }

            var uploadedUrl = await _fileUploadService.UploadFileAsync(wallpaperDto.ImageFile);
            if (uploadedUrl != null)
            {
                imageUrl = uploadedUrl;
            }
        }
        else if (!string.IsNullOrEmpty(wallpaperDto.ImageUrl))
        {
            // Use the provided URL
            imageUrl = wallpaperDto.ImageUrl;
        }

        // Create updated wallpaper with ALL required properties
        var updatedWallpaper = new Wallpaper
        {
            Id = id, // IMPORTANT: Include the ID
            Title = wallpaperDto.Title ?? existingWallpaper.Title,
            Description = wallpaperDto.Description ?? existingWallpaper.Description,
            ImageUrl = imageUrl,
            CategoryId = wallpaperDto.CategoryId > 0 ? wallpaperDto.CategoryId : existingWallpaper.CategoryId,
            CreatedAt = existingWallpaper.CreatedAt, // Keep original creation date
            Downloads = existingWallpaper.Downloads, // Keep existing counts
            Likes = existingWallpaper.Likes
        };

        var updated = await _dataService.UpdateWallpaperAsync(id, updatedWallpaper);

        if (updated == null) 
            return NotFound();

        // Build full URL for the image
        string fullImageUrl = updated.ImageUrl;
        if (updated.ImageUrl.StartsWith("/uploads/"))
        {
            var request = HttpContext.Request;
            fullImageUrl = $"{request.Scheme}://{request.Host}{updated.ImageUrl}";
        }

        return Ok(new
        {
            id = updated.Id,
            title = updated.Title,
            description = updated.Description,
            imageUrl = fullImageUrl,
            category = updated.Category?.Name
        });
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Update error: {ex.Message}");
        return StatusCode(500, $"Internal server error: {ex.Message}");
    }
}

        // DELETE /api/wallpapers/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteWallpaper(int id)
        {
            var wallpaper = await _dataService.GetWallpaperByIdAsync(id);
            if (wallpaper == null)
                return NotFound();

            // Delete associated file if it was an uploaded file
            if (!string.IsNullOrEmpty(wallpaper.ImageUrl) && 
                wallpaper.ImageUrl.StartsWith("/uploads/"))
            {
                _fileUploadService.DeleteFile(wallpaper.ImageUrl);
            }

            var deleted = await _dataService.DeleteWallpaperAsync(id);

            if (!deleted)
                return NotFound();

            return Ok(new { message = "Wallpaper deleted successfully." });
        }
        // GET /api/wallpapers/download/{id}
[HttpGet("download/{id:int}")]
public async Task<IActionResult> DownloadWallpaper(int id)
{
    var wallpaper = await _dataService.GetWallpaperByIdAsync(id);

    if (wallpaper == null)
        return NotFound("Wallpaper not found");

    // Increment downloads
    wallpaper.Downloads += 1;
    await _dataService.UpdateWallpaperdownloadAsync(id, wallpaper);

    if (wallpaper.ImageUrl.StartsWith("/uploads/"))
    {
        string filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", wallpaper.ImageUrl.TrimStart('/'));
        if (!System.IO.File.Exists(filePath))
            return NotFound("Image file not found");

        var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
        string fileName = Path.GetFileName(filePath);
        return File(fileBytes, "application/octet-stream", fileName);
    }

    // External URL
    return Redirect(wallpaper.ImageUrl);
}

[HttpPost("{id}/download")]
public async Task<IActionResult> IncrementDownloadCount(int id)
{
    var success = await _dataService.IncrementDownloadsAsync(id);
    if (!success) return NotFound();
    return Ok();
}

// [HttpPost("{id}/like")]
// public async Task<IActionResult> LikeWallpaper(int id)
// {
//     var success = await _dataService.IncrementLikesAsync(id);
//     if (!success) return NotFound();
//     return Ok();
// }
[HttpPost("{id}/like")]
public async Task<IActionResult> LikeWallpaper(int id, [FromBody] LikeDto dto)
{
    if (string.IsNullOrEmpty(dto.UserEmail))
        return BadRequest("UserEmail is required");

    var wallpaper = await _dataService.GetWallpaperByIdAsync(id);
    if (wallpaper == null) return NotFound();

    if (wallpaper.LikedBy.Contains(dto.UserEmail))
        return BadRequest("User already liked this wallpaper");

    wallpaper.LikedBy.Add(dto.UserEmail);
    wallpaper.Likes = wallpaper.LikedBy.Count;

    await _dataService.UpdateWallpaperAsync(id, wallpaper);

    return Ok(new { likedBy = wallpaper.LikedBy });
}

[HttpPost("{id}/unlike")]
public async Task<IActionResult> UnlikeWallpaper(int id, [FromBody] LikeDto dto)
{
    if (string.IsNullOrEmpty(dto.UserEmail))
        return BadRequest("UserEmail is required");

    var wallpaper = await _dataService.GetWallpaperByIdAsync(id);
    if (wallpaper == null) return NotFound();

    if (wallpaper.LikedBy.Contains(dto.UserEmail))
    {
        wallpaper.LikedBy.Remove(dto.UserEmail);
        wallpaper.Likes = wallpaper.LikedBy.Count;
        await _dataService.UpdateWallpaperAsync(id, wallpaper);
    }

    return Ok(new { likedBy = wallpaper.LikedBy });
}



    }

    // DTOs for file upload
    public class WallpaperCreateDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int CategoryId { get; set; }
        public string? ImageUrl { get; set; }
        public IFormFile? ImageFile { get; set; }
    }

    public class WallpaperUpdateDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int CategoryId { get; set; }
        public string? ImageUrl { get; set; }
        public IFormFile? ImageFile { get; set; }
    }
    public class LikeDto
{
    public string UserEmail { get; set; } = string.Empty;
}

}