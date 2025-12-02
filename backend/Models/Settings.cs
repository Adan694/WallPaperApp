public class Settings
{
    public int Id { get; set; }

    public string SiteName { get; set; } = "";
    public string SiteDescription { get; set; } = "";
    public string AllowedFileTypes { get; set; } = "jpg,png,webp";
    public int MaxUploadSize { get; set; }
    public string DefaultLanguage { get; set; } = "en";

    public string DefaultCategory { get; set; } = "Nature";
    public bool AutoApproveUploads { get; set; }
    public bool EnableUserUploads { get; set; }

    public string PasswordPolicy { get; set; } = "";
    public bool Enable2FA { get; set; }

    public string DefaultTheme { get; set; } = "light";
    public string DefaultLayout { get; set; } = "grid";
    public string CategoryColor { get; set; } = "#ff0000";

    public int SessionTimeout { get; set; } = 30;
    public bool MaintenanceMode { get; set; }
    public string IpWhitelist { get; set; } = "";
    
    public string? SiteLogoUrl { get; set; }
}
