using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Route("api/test")]
public class TestController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(new { msg = "Backend is working ✅" });
}
