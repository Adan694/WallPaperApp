using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/categories")]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public CategoriesController(AppDbContext db)
        {
            _db = db;
        }

        // GET /api/categories
        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _db.Categories
                .Select(c => new
                {
                    id = c.Id,               // match frontend JSON
                    name = c.Name,
                    primary = c.PrimaryColor,   // renamed to match old API
                    secondary = c.SecondaryColor
                })
                .ToListAsync();

            return Ok(categories);
        }
    }
}
