using System.Text.Json;
using Backend.Models;

namespace Backend.Data
{
    public static class WallpaperSeeder
    {
        public static async Task SeedAsync(AppDbContext context)
        {
            if (!context.Wallpapers.Any())
            {
                // Read the JSON file
                var json = await File.ReadAllTextAsync("Data/wallpapers.json"); // path to your JSON
                var wallpapers = JsonSerializer.Deserialize<List<Wallpaper>>(json);

                if (wallpapers != null)
                {
                    context.Wallpapers.AddRange(wallpapers);
                    await context.SaveChangesAsync();
                    Console.WriteLine("Wallpapers seeded successfully!");
                }
            }
        }
    }
}
