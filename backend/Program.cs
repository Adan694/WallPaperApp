using Backend.Data;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer("Server=DESKTOP-VALVQ9A;Database=WallpaperDB;Trusted_Connection=True;TrustServerCertificate=True;"));
builder.Services.AddScoped<DataService>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<AuthService>();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});


var app = builder.Build();

// Seed data
// Seed data
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();

    // Seed categories only if none exist
    if (!db.Categories.Any())
    {
        var categoriesList = new List<Category>  // CHANGED: categoriesList instead of categories
        {
            new Category { Name = "Nature", PrimaryColor = "#4CAF50", SecondaryColor = "#E8F5E9" },
            new Category { Name = "Space", PrimaryColor = "#2196F3", SecondaryColor = "#E3F2FD" },
            new Category { Name = "Abstract", PrimaryColor = "#FF5722", SecondaryColor = "#FBE9E7" },
            new Category { Name = "Animals", PrimaryColor = "#FF9800", SecondaryColor = "#FFF3E0" },
            new Category { Name = "Cities", PrimaryColor = "#9C27B0", SecondaryColor = "#F3E5F5" },
            new Category { Name = "Travel", PrimaryColor = "#00BCD4", SecondaryColor = "#E0F7FA" },
            new Category { Name = "Technology", PrimaryColor = "#607D8B", SecondaryColor = "#ECEFF1" },
            new Category { Name = "Food", PrimaryColor = "#FF7043", SecondaryColor = "#FFF3E0" },
            new Category { Name = "Sports", PrimaryColor = "#3F51B5", SecondaryColor = "#E8EAF6" },
            new Category { Name = "Music", PrimaryColor = "#E91E63", SecondaryColor = "#FCE4EC" },
            new Category { Name = "Art", PrimaryColor = "#795548", SecondaryColor = "#EFEBE9" },
            new Category { Name = "Cars", PrimaryColor = "#F44336", SecondaryColor = "#FFEBEE" },
            new Category { Name = "Fashion", PrimaryColor = "#009688", SecondaryColor = "#E0F2F1" },
            new Category { Name = "History", PrimaryColor = "#FFEB3B", SecondaryColor = "#FFFDE7" },
            new Category { Name = "Movies", PrimaryColor = "#673AB7", SecondaryColor = "#EDE7F6" }
        };
        db.Categories.AddRange(categoriesList);  // CHANGED: categoriesList instead of categories
        db.SaveChanges();
    }

    // Clear and reseed wallpapers - REMOVE THE IF CONDITION
   // Seed wallpapers only if none exist
if (!db.Wallpapers.Any())
{
    var allCategories = db.Categories.ToList();
    var wallpapers = new List<Wallpaper>();
    for (int i = 1; i <= 100; i++)
    {
        var category = allCategories[i % allCategories.Count];
        wallpapers.Add(new Wallpaper
        {
            Title = $"{category.Name} Wallpaper {i}",
            ImageUrl = $"https://loremflickr.com/400/300/{category.Name.ToLower()}?lock={i}",
            Description = $"Beautiful {category.Name.ToLower()} wallpaper number {i}.",
            CategoryId = category.Id
        });
    }
    db.Wallpapers.AddRange(wallpapers);
    db.SaveChanges();
}
}

app.UseCors();

app.UseSwagger();
app.UseSwaggerUI();
app.UseHttpsRedirection();
app.UseAuthorization();
app.UseAuthentication();
app.MapControllers();
app.Run();

