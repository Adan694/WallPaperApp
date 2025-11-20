using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace Backend.Data
{
    public class AuthService
    {
        private readonly AppDbContext _db;

        public AuthService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<User?> RegisterUser(string name, string email, string password)
        {
            if (await _db.Users.AnyAsync(u => u.Email == email))
                return null;

            var hash = HashPassword(password);

            var user = new User
            {
                Name = name,
                Email = email,
                PasswordHash = hash,
                Role = "user"
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return user;
        }

        public async Task<User?> LoginUser(string email, string password)
        {
            var hash = HashPassword(password);
            return await _db.Users.FirstOrDefaultAsync(
                u => u.Email == email && u.PasswordHash == hash
            );
        }

        private string HashPassword(string password)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToHexString(bytes);
        }
    }
}
