# Wallpaper Web Application

A full-stack web application for browsing, downloading, and managing wallpapers. Built with Angular frontend and ASP.NET Core backend API with SQL Server database.

## Features

### User Features
- Browse wallpapers by category
- Search wallpapers by title or description
- View wallpaper details with high-resolution image
- Download wallpapers with automatic download count tracking
- Like and unlike wallpapers (user-specific, prevents duplicate likes)
- Responsive design for desktop, tablet, and mobile devices

### Admin Features
- User management (view all users, delete users, change user roles)
- Category management (add, edit, delete categories)
- Wallpaper management (add, edit, delete wallpapers)
- Upload wallpaper images via file upload or external URL
- Analytics dashboard with:
  - Total wallpapers count
  - Total categories count
  - Total downloads across all wallpapers
  - Total likes across all wallpapers
  - Most popular category
  - Recent uploads (last 7 days)
  - Storage usage estimation
- Recent activities log
- System settings configuration:
  - Site name and description
  - Site logo upload
  - Allowed file types
  - Maximum upload size limit
  - Auto-approve uploads toggle
  - Maintenance mode
  - Session timeout
  - IP whitelist
  - Password policy
  - Two-factor authentication toggle
  - Default theme and layout

### Authentication & Authorization
- User registration with email and password
- User login with JWT token generation
- Role-based access control (User, Admin)
- Token-based API authentication
- 7-day token expiration

## Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | Angular, TypeScript, HTML, SCSS |
| Backend | ASP.NET Core Web API, C# |
| Database | SQL Server with Entity Framework |
| File Storage | Local file system (wwwroot/uploads) |
| Authentication | JWT (JSON Web Tokens) |

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login and receive JWT token |

### Wallpapers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/wallpapers | Get all wallpapers |
| GET | /api/wallpapers/{id} | Get wallpaper by ID |
| GET | /api/wallpapers/category/{category} | Get wallpapers by category |
| GET | /api/wallpapers/search?q={query} | Search wallpapers |
| GET | /api/wallpapers/download/{id} | Download wallpaper (increments count) |
| POST | /api/wallpapers | Add new wallpaper (admin) |
| POST | /api/wallpapers/{id}/download | Increment download count |
| POST | /api/wallpapers/{id}/like | Like wallpaper |
| POST | /api/wallpapers/{id}/unlike | Unlike wallpaper |
| PUT | /api/wallpapers/{id} | Update wallpaper (admin) |
| DELETE | /api/wallpapers/{id} | Delete wallpaper (admin) |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/categories | Get all categories |
| POST | /api/categories | Add new category (admin) |
| PUT | /api/categories/{id} | Update category (admin) |
| DELETE | /api/categories/{id} | Delete category (admin) |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/users | Get all users |
| DELETE | /api/admin/users/{id} | Delete user |
| PUT | /api/admin/users/{id}/role | Change user role |
| GET | /api/admin/analytics | Get dashboard analytics |
| GET | /api/admin/activities | Get recent activities |

### Settings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/settings | Get system settings |
| PUT | /api/settings | Update system settings |

## Database Models

### User Model
- Id (int, primary key)
- Name (string)
- Email (string, unique)
- Password (string, hashed)
- Role (string: User/Admin)
- CreatedAt (DateTime)

### Wallpaper Model
- Id (int, primary key)
- Title (string)
- Description (string)
- ImageUrl (string)
- CategoryId (int, foreign key)
- Downloads (int)
- Likes (int)
- LikedBy (List<string> - user emails)
- CreatedAt (DateTime)

### Category Model
- Id (int, primary key)
- Name (string)
- PrimaryColor (string)
- SecondaryColor (string)

### Settings Model
- Id (int, primary key)
- SiteName (string)
- SiteDescription (string)
- SiteLogoUrl (string)
- AllowedFileTypes (string)
- MaxUploadSize (int)
- AutoApproveUploads (bool)
- EnableUserUploads (bool)
- MaintenanceMode (bool)
- SessionTimeout (int)
- And additional configuration fields

## Project Structure

WallPaperApp/
├── backend/
│   ├── Controllers/       # API endpoints (Auth, Wallpaper, Category, Admin, Settings)
│   ├── Models/            # Database entities
│   ├── Data/              # DbContext and DataService
│   ├── Migrations/        # Entity Framework migrations
│   ├── Properties/        # Launch settings
│   ├── wwwroot/uploads/   # Uploaded wallpaper images
│   ├── appsettings.json   # Configuration (JWT, connection string)
│   ├── Program.cs         # Application entry point
│   └── Backend.csproj     # Project dependencies
├── frontend/
│   ├── src/app/           # Angular components and services
│   ├── src/assets/        # Static assets
│   ├── index.html         # Main HTML file
│   ├── styles.scss        # Global styles
│   ├── angular.json       # Angular CLI configuration
│   └── package.json       # Frontend dependencies
└── README.md

## Installation

### Prerequisites
- .NET 8.0 SDK or later
- Node.js (v14 or higher)
- SQL Server (LocalDB or full instance)
- Angular CLI

### Backend Setup

1. Navigate to backend folder:
cd backend

2. Update connection string in appsettings.json:
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=WallpaperDB;Trusted_Connection=True;MultipleActiveResultSets=true"
}

3. Configure JWT settings in appsettings.json:
"Jwt": {
  "Key": "your-secret-key-here-minimum-32-characters",
  "Issuer": "WallpaperAPI",
  "Audience": "WallpaperClient"
}

4. Run database migrations:
dotnet ef database update

5. Start the backend server:
dotnet run

The API will run at https://localhost:5001 or http://localhost:5000

### Frontend Setup

1. Navigate to frontend folder:
cd frontend

2. Install dependencies:
npm install

3. Update API base URL in environment files (if needed)

4. Start the development server:
ng serve

5. Open your browser to http://localhost:4200

## Deployment

### Backend Deployment (IIS/Azure)
- Configure CORS to allow frontend origin
- Set up production database connection string
- Update JWT settings with secure keys
- Configure file upload directory permissions

### Frontend Deployment (Vercel/Netlify)
- Build for production: ng build --prod
- Deploy the dist/ folder
- Configure environment.prod.ts with production API URL

## Author

Amna Shehzad

GitHub: https://github.com/Adan694
LinkedIn: https://linkedin.com/in/amna-shehzad-373bba361
Email: ashehzad0100@gmail.com
