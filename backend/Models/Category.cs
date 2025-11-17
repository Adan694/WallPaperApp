namespace Backend.Models
{
    using System.Text.Json.Serialization;

    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string PrimaryColor { get; set; } = string.Empty;
        public string SecondaryColor { get; set; } = string.Empty;
            [JsonIgnore] // <-- prevents cycle

        public ICollection<Wallpaper> Wallpapers { get; set; } = new List<Wallpaper>();
    }
}
