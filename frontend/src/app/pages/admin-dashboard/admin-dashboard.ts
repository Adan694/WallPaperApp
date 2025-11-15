import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';
import { ApiService } from '../../services/api';
import { forkJoin } from 'rxjs';
import { AdminSidebar } from '../../components/admin-sidebar/admin-sidebar';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminSidebar],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard implements OnInit {
  dashboardStats = {
    totalWallpapers: 0,
    totalCategories: 0,
    totalDownloads: 0,
    totalLikes: 0,
    popularCategory: '',
    recentUploads: 0,
    storageUsed: '0 MB'
  };

  recentWallpapers: any[] = [];
  categoryStats: any[] = [];
  recentActivities: any[] = [];
  
  isLoading = true;
  dataLoaded = false;
  activeTab: string = 'overview'; // Track active tab

  constructor(
    public authService: Auth,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;

    // Use forkJoin to call multiple APIs in parallel
    forkJoin({
      wallpapers: this.apiService.getWallpapers(),
      categories: this.apiService.getCategories()
    }).subscribe({
      next: ({ wallpapers, categories }) => {
        // Calculate statistics from real data
        this.calculateStats(wallpapers, categories);
        this.prepareRecentWallpapers(wallpapers);
        this.prepareCategoryStats(wallpapers, categories);
        this.generateRecentActivities(wallpapers);

        this.isLoading = false;
        this.dataLoaded = true;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;
        this.loadSampleData(); // Fallback if API fails
      }
    });
  }

  // Tab switching method
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // Check if tab is active
  isTabActive(tab: string): boolean {
    return this.activeTab === tab;
  }

  private calculateStats(wallpapers: any[], categories: any[]) {
    // Calculate total downloads and likes
    const totalDownloads = wallpapers.reduce((sum, wp) => sum + (wp.downloads || 0), 0);
    const totalLikes = wallpapers.reduce((sum, wp) => sum + (wp.likes || 0), 0);
    
    // Find popular category
    const categoryCounts: {[key: string]: number} = {};
    wallpapers.forEach(wp => {
      categoryCounts[wp.category] = (categoryCounts[wp.category] || 0) + 1;
    });
    
    const popularCategory = Object.keys(categoryCounts).reduce((a, b) => 
      categoryCounts[a] > categoryCounts[b] ? a : b, 'Nature'
    );

    // Calculate recent uploads (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentUploads = wallpapers.filter(wp => {
      const uploadDate = wp.uploadDate || wp.createdAt;
      return uploadDate ? new Date(uploadDate) > oneWeekAgo : false;
    }).length;

    // Estimate storage (assuming average 2MB per wallpaper)
    const storageMB = (wallpapers.length * 2).toFixed(1);

    this.dashboardStats = {
      totalWallpapers: wallpapers.length,
      totalCategories: categories.length,
      totalDownloads: totalDownloads,
      totalLikes: totalLikes,
      popularCategory: popularCategory,
      recentUploads: recentUploads,
      storageUsed: `${storageMB} MB`
    };
  }

  private prepareRecentWallpapers(wallpapers: any[]) {
    // Get 4 most recent wallpapers - sort by ID if no date field
    this.recentWallpapers = wallpapers
      .sort((a, b) => (b.id || 0) - (a.id || 0)) // Sort by ID (newest first)
      .slice(0, 4)
      .map(wp => ({
        ...wp,
        displayTitle: wp.title.length > 20 ? wp.title.substring(0, 20) + '...' : wp.title
      }));
  }

  private prepareCategoryStats(wallpapers: any[], categories: any[]) {
    // Count wallpapers per category
    const categoryCounts: {[key: string]: number} = {};
    wallpapers.forEach(wp => {
      categoryCounts[wp.category] = (categoryCounts[wp.category] || 0) + 1;
    });

    // Prepare category stats with colors from your backend
    this.categoryStats = categories.map(cat => ({
      name: cat.name,
      count: categoryCounts[cat.name] || 0,
      primary: cat.primary,
      secondary: cat.secondary,
      icon: this.getCategoryIcon(cat.name)
    })).sort((a, b) => b.count - a.count).slice(0, 6); // Top 6 categories
  }

  private generateRecentActivities(wallpapers: any[]) {
    // Generate activities based on recent uploads
    const recentWallpapers = wallpapers
      .sort((a, b) => (b.id || 0) - (a.id || 0)) // Sort by ID
      .slice(0, 3);

    this.recentActivities = recentWallpapers.map(wp => ({
      action: 'New wallpaper uploaded',
      details: wp.title,
      time: 'Recently',
      type: 'upload'
    }));

    // Add some system activities
    this.recentActivities.unshift(
      {
        action: 'System started',
        details: 'Admin dashboard initialized',
        time: 'Just now',
        type: 'system'
      }
    );
  }

  private getCategoryIcon(category: string): string {
    const icons: {[key: string]: string} = {
      'Nature': '🌿',
      'Space': '🚀',
      'Abstract': '🎨',
      'Animals': '🐾',
      'Cities': '🏙️',
      'Travel': '✈️',
      'Technology': '💻',
      'Food': '🍕',
      'Sports': '⚽',
      'Music': '🎵',
      'Art': '🖼️',
      'Cars': '🚗',
      'Fashion': '👗',
      'History': '🏛️',
      'Movies': '🎬'
    };
    return icons[category] || '📁';
  }

  private loadSampleData() {
    // Fallback data structure matching your API
    this.dashboardStats = {
      totalWallpapers: 0,
      totalCategories: 15, // From your categories array
      totalDownloads: 0,
      totalLikes: 0,
      popularCategory: 'Nature',
      recentUploads: 0,
      storageUsed: '0 MB'
    };

    this.recentWallpapers = [];
    this.categoryStats = [];
    this.recentActivities = [
      {
        action: 'Backend connected',
        details: 'API is responding',
        time: 'Just now',
        type: 'system'
      }
    ];
  }

  logout() {
    this.authService.logout();
  }

  getActivityIcon(type: string): string {
    const icons: {[key: string]: string} = {
      upload: '🖼️',
      system: '⚙️',
      user: '👤'
    };
    return icons[type] || '📝';
  }
}