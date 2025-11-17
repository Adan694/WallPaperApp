using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/categories")]
    public class CategoriesController : ControllerBase
    {
        private readonly DataService _dataService;

        public CategoriesController(DataService dataService)
        {
            _dataService = dataService;
        }

        // GET /api/categories
       [HttpGet]
public async Task<IActionResult> GetCategories()
{
    var categories = await _dataService.GetCategoriesAsync();

    var result = categories.Select(c => new
    {
        id = c.Id,
        name = c.Name,
        primary = c.PrimaryColor,
        secondary = c.SecondaryColor
    });

    return Ok(result);
}


        // POST /api/categories
        [HttpPost]
        public async Task<IActionResult> AddCategory([FromBody] Category category)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _dataService.AddCategoryAsync(category);
 return Ok(new
    {
        id = created.Id,
        name = created.Name,
        primary = created.PrimaryColor,
        secondary = created.SecondaryColor
    });        }

        // PUT /api/categories/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] Category category)
        {
            var updated = await _dataService.UpdateCategoryAsync(id, category);
            if (updated == null)
                return NotFound();

            return Ok(updated);
        }

        // DELETE /api/categories/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var deleted = await _dataService.DeleteCategoryAsync(id);
            if (!deleted)
                return NotFound();

            return Ok(new { message = "Category deleted successfully." });
        }
    }
}
