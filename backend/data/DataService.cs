using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class DataService
    {
        private readonly AppDbContext _context;

        public DataService(AppDbContext context)
        {
            _context = context;
        }

        // Get all categories
        public async Task<List<Category>> GetCategoriesAsync()
        {
            return await _context.Categories.ToListAsync();
        }

        // Get all wallpapers (stable order, category name as string)
      // In DataService.cs - update the GetWallpapersAsync method
public async Task<List<object>> GetWallpapersAsync()
{
    var wallpapers = await _context.Wallpapers
        .Include(w => w.Category)
        .OrderBy(w => w.Id)
        .Select(w => new
        {
            id = w.Id,
            title = w.Title,
            description = w.Description,
            imageUrl = w.ImageUrl,
            category = w.Category.Name,
            downloads = w.Downloads,
            likes = w.Likes,
            createdAt = w.CreatedAt
        })
        .ToListAsync();

    return wallpapers.Cast<object>().ToList();
}
        // Get wallpaper by ID
        public async Task<Wallpaper?> GetWallpaperByIdAsync(int id)
        {
            return await _context.Wallpapers
                                 .Include(w => w.Category)
                                 .FirstOrDefaultAsync(w => w.Id == id);
        }

        // Get wallpapers by category (stable order)
        public async Task<List<object>> GetWallpapersByCategoryAsync(string category)
        {
            var wallpapers = await _context.Wallpapers
                .Include(w => w.Category)
                .Where(w => w.Category.Name.ToLower() == category.ToLower())
                .OrderBy(w => w.Id)
                .Select(w => new
                {
                    id = w.Id,
                    title = w.Title,
                    description = w.Description,
                    imageUrl = w.ImageUrl,
                    category = w.Category.Name
                })
                .ToListAsync();

            return wallpapers.Cast<object>().ToList();
        }

        // Search wallpapers by title or category
        public async Task<List<Wallpaper>> SearchWallpapersAsync(string keyword)
        {
            return await _context.Wallpapers
                                 .Include(w => w.Category)
                                 .Where(w => w.Title.Contains(keyword) ||
                                             w.Category.Name.Contains(keyword, StringComparison.OrdinalIgnoreCase))
                                 .OrderBy(w => w.Id) // stable order
                                 .ToListAsync();
        }
        public async Task<Wallpaper> AddWallpaperAsync(Wallpaper wallpaper)
    {
        _context.Wallpapers.Add(wallpaper);
        await _context.SaveChangesAsync();
        return wallpaper;
    }

    // ------------------- UPDATE -------------------
   // ------------------- UPDATE -------------------
public async Task<Wallpaper?> UpdateWallpaperAsync(int id, Wallpaper updated)
{
    try
    {
        // Find the existing entity WITH tracking
        var existing = await _context.Wallpapers
            .Include(w => w.Category)
            .FirstOrDefaultAsync(w => w.Id == id);

        if (existing == null)
            return null;

        // Update only the properties that are provided (allow partial updates)
        if (!string.IsNullOrEmpty(updated.Title))
            existing.Title = updated.Title;
            
        if (!string.IsNullOrEmpty(updated.Description))
            existing.Description = updated.Description;
            
        if (!string.IsNullOrEmpty(updated.ImageUrl))
            existing.ImageUrl = updated.ImageUrl;
            
        if (updated.CategoryId > 0)
            existing.CategoryId = updated.CategoryId;

        // Mark as modified and save
        _context.Wallpapers.Update(existing);
        await _context.SaveChangesAsync();
        
        return existing;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Update error: {ex.Message}");
        Console.WriteLine($"Inner exception: {ex.InnerException?.Message}");
        throw;
    }
}

    // ------------------- DELETE -------------------
    public async Task<bool> DeleteWallpaperAsync(int id)
    {
        var wallpaper = await _context.Wallpapers.FindAsync(id);
        if (wallpaper == null)
            return false;

        _context.Wallpapers.Remove(wallpaper);
        await _context.SaveChangesAsync();
        
        return true;
    }
    // Add Category
// Get all categories
// public async Task<List<Category>> GetCategoriesAsync()
// {
//     return await _context.Categories.ToListAsync();
// }

// Add Category
public async Task<Category> AddCategoryAsync(Category category)
{
    _context.Categories.Add(category);
    await _context.SaveChangesAsync();
    return category;
}

// Update Category
public async Task<Category?> UpdateCategoryAsync(int id, Category updated)
{
    var existing = await _context.Categories.FindAsync(id);
    if (existing == null) return null;

    existing.Name = updated.Name;
    existing.PrimaryColor = updated.PrimaryColor;
    existing.SecondaryColor = updated.SecondaryColor; // optional

    await _context.SaveChangesAsync();
    return existing;
}

// Delete Category
public async Task<bool> DeleteCategoryAsync(int id)
{
    var category = await _context.Categories.FindAsync(id);
    if (category == null) return false;

    _context.Categories.Remove(category);
    await _context.SaveChangesAsync();
    return true;
}

    }
}
