using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/settings")]
    public class SettingsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly FileUploadService _fileUploadService;

        public SettingsController(AppDbContext context, FileUploadService fileUploadService)
        {
            _context = context;
            _fileUploadService = fileUploadService;
        }

        [HttpGet]
        public async Task<IActionResult> GetSettings()
        {
            var settings = await _context.Settings.FirstOrDefaultAsync();

            if (settings == null)
            {
                settings = new Settings();
                _context.Settings.Add(settings);
                await _context.SaveChangesAsync();
            }

            return Ok(settings);
        }

        [HttpPut]
public async Task<IActionResult> UpdateSettings([FromForm] IFormCollection form)
        {
          var settings = await _context.Settings.FirstOrDefaultAsync();
if (settings == null)
    return NotFound();

// Map form values manually
settings.SiteName = form["siteName"];
settings.SiteDescription = form["siteDescription"];
settings.AllowedFileTypes = form["allowedFileTypes"];
settings.MaxUploadSize = int.Parse(form["maxUploadSize"]);
settings.DefaultLanguage = form["defaultLanguage"];
settings.DefaultCategory = form["defaultCategory"];
settings.AutoApproveUploads = bool.Parse(form["autoApproveUploads"]);
settings.EnableUserUploads = bool.Parse(form["enableUserUploads"]);
settings.PasswordPolicy = form["passwordPolicy"];
settings.Enable2FA = bool.Parse(form["enable2FA"]);
settings.DefaultTheme = form["defaultTheme"];
settings.DefaultLayout = form["defaultLayout"];
settings.CategoryColor = form["categoryColor"];
settings.SessionTimeout = int.Parse(form["sessionTimeout"]);
settings.MaintenanceMode = bool.Parse(form["maintenanceMode"]);
settings.IpWhitelist = form["ipWhitelist"];

// Handle uploaded file
if (Request.Form.Files.Count > 0)
{
    var file = Request.Form.Files[0];
    var url = await _fileUploadService.UploadFileAsync(file);
    settings.SiteLogoUrl = url;
}

await _context.SaveChangesAsync();
return Ok(settings);

        }
    }
}

