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

        public WallpaperController(DataService dataService)
        {
            _dataService = dataService;
        }

        // GET /api/wallpapers
        [HttpGet]
        public async Task<IActionResult> GetWallpapers()
        {
            var wallpapers = await _dataService.GetWallpapersAsync();
            return Ok(wallpapers);
        }

        // GET /api/wallpapers/{id}  -> numeric IDs
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetWallpaperById(int id)
        {
            var wallpaper = await _dataService.GetWallpaperByIdAsync(id);
            if (wallpaper == null) return NotFound();

            return Ok(new
            {
                id = wallpaper.Id,
                title = wallpaper.Title,
                description = wallpaper.Description,
                imageUrl = wallpaper.ImageUrl,
                category = wallpaper.Category.Name
            });
        }

        // GET /api/wallpapers/{category} -> string category names
[HttpGet("category/{category}")]
        public async Task<IActionResult> GetWallpapersByCategory(string category)
        {
            var wallpapers = await _dataService.GetWallpapersByCategoryAsync(category);
            return Ok(wallpapers);
        }

        // GET /api/wallpapers/search?q=...
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string q)
        {
            var wallpapers = await _dataService.SearchWallpapersAsync(q);
            var result = wallpapers.Select(w => new
            {
                id = w.Id,
                title = w.Title,
                description = w.Description,
                imageUrl = w.ImageUrl,
                category = w.Category.Name
            });

            return Ok(result);
        }

          // ------------------- ADD (POST) -------------------
        [HttpPost]
        public async Task<IActionResult> AddWallpaper([FromBody] Wallpaper wallpaper)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _dataService.AddWallpaperAsync(wallpaper);
            return Ok(created);
        }

        // ------------------- UPDATE (PUT) -------------------
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateWallpaper(int id, [FromBody] Wallpaper wallpaper)
        {
            var updated = await _dataService.UpdateWallpaperAsync(id, wallpaper);

            if (updated == null) 
                return NotFound();

            return Ok(updated);
        }

        // ------------------- DELETE (DELETE) -------------------
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteWallpaper(int id)
        {
            var deleted = await _dataService.DeleteWallpaperAsync(id);

            if (!deleted)
                return NotFound();

            return Ok(new { message = "Wallpaper deleted successfully." });
        }
    }
}
