namespace Backend.Models
{
    public class Wallpaper
{
    public int Id { get; set; }
   public required string Title { get; set; }
public required string ImageUrl { get; set; }
public required string Description { get; set; }
public int CategoryId { get; set; }       // foreign key
public Category? Category { get; set; } 
}

}
