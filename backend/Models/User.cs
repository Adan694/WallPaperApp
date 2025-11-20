namespace Backend.Models
{
    public class User
    {
        public int Id { get; set; }

        public string Name { get; set; } = "";
        public string Email { get; set; } = "";
        public string PasswordHash { get; set; } = "";
        public string Role { get; set; } = "user";  // "admin" or "user"

        // Add this
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
