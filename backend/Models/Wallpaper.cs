// namespace Backend.Models
// {
//     public class Wallpaper
// {
//     public int Id { get; set; }
//    public required string Title { get; set; }
// public required string ImageUrl { get; set; }
// public required string Description { get; set; }
// public int CategoryId { get; set; }       // foreign key
// public Category? Category { get; set; } 
// }

// }
// In your Wallpaper model, ensure you have both properties
namspace Backend.Models
{
public class Wallpaper
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string? ImageFile { get; set; } // Add this for uploaded files
    public string? Description { get; set; }
    public int CategoryId { get; set; }
    public Category? Category { get; set; }
    public int Downloads { get; set; } = 0;
    public int Likes { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
}