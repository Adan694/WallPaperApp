using System.ComponentModel.DataAnnotations.Schema; // Add this line

namespace Backend.Models
{
    public class Wallpaper
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int CategoryId { get; set; }
        public Category? Category { get; set; }
        public int Downloads { get; set; } = 0;
        public int Likes { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // This property is only for form binding, not stored in database
        [NotMapped]
        public IFormFile? ImageFile { get; set; }
            public List<string> LikedBy { get; set; } = new List<string>();

    }
}