using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Data; // Your DbContext
using Backend.Models; // User model
using Microsoft.EntityFrameworkCore;

namespace YourApp.Controllers
{
    [Route("api/admin")]
    [ApiController]
    // [Authorize(Roles = "admin")]
    [AllowAnonymous]

    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/admin/users
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new {
                    u.Id,
                    u.Name,
                    u.Email,
                    u.Role,
                    u.CreatedAt
                })
                .ToListAsync();

            return Ok(users);
        }

        // DELETE: api/admin/users/{id}
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User deleted successfully" });
        }

        // PUT: api/admin/users/{id}/role
        [HttpPut("users/{id}/role")]
        public async Task<IActionResult> ChangeUserRole(int id, [FromBody] string newRole)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            user.Role = newRole;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"User role updated to {newRole}" });
        }
        [HttpGet("analytics")]
public async Task<IActionResult> GetAnalytics()
{
    var wallpapers = await _context.Wallpapers.ToListAsync();
    var categories = await _context.Categories.ToListAsync();

    // ---- TOTALS ----
    var totalWallpapers = wallpapers.Count;
    var totalCategories = categories.Count;
    var totalDownloads = wallpapers.Sum(w => w.Downloads);
    var totalLikes = wallpapers.Sum(w => w.Likes);

    // ---- POPULAR CATEGORY ----
    var popularCategory = wallpapers
        .GroupBy(w => w.CategoryId)
        .OrderByDescending(g => g.Count())
        .Select(g => categories.First(c => c.Id == g.Key).Name)
        .FirstOrDefault() ?? "N/A";

    // ---- RECENT UPLOADS (last 7 days) ----
    var oneWeekAgo = DateTime.UtcNow.AddDays(-7);
    var recentUploads = wallpapers
        .Where(w => w.CreatedAt >= oneWeekAgo)
        .OrderByDescending(w => w.CreatedAt)
        .Take(10)
        .ToList();

    // ---- Storage ESTIMATION (2 MB per wallpaper) ----
    var storageUsed = $"{(totalWallpapers * 2)} MB";

    return Ok(new
    {
        totalWallpapers,
        totalCategories,
        totalDownloads,
        totalLikes,
        popularCategory,
        recentUploads,
        storageUsed
    });
}
[HttpGet("activities")]
public async Task<IActionResult> GetRecentActivities()
{
    // Just using wallpaper uploads as activity logs
    var recent = await _context.Wallpapers
        .OrderByDescending(w => w.CreatedAt)
        .Take(10)
        .ToListAsync();

    var logs = recent.Select(w => new {
        type = "upload",
        action = "New wallpaper uploaded",
        details = w.Title,
        time = w.CreatedAt.ToString("yyyy-MM-dd HH:mm")
    });

    // Add system event
    var systemEvent = new[] {
        new {
            type = "system",
            action = "System initialized",
            details = "Admin dashboard loaded.",
            time = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm")
        }
    };

    return Ok(systemEvent.Concat(logs));
}

    }
}
