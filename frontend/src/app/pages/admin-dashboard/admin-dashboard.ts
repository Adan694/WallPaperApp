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

    forkJoin({
      wallpapers: this.apiService.getWallpapers(),
      categories: this.apiService.getCategories(),
      analytics: this.apiService.getAnalytics(),
      activities: this.apiService.getAdminActivities()
    }).subscribe({
      next: ({ wallpapers, categories, analytics, activities }) => {
        this.dashboardStats = {
          totalWallpapers: wallpapers.length,
          totalCategories: categories.length,
          totalDownloads: analytics.totalDownloads,
          totalLikes: analytics.totalLikes,
          popularCategory: analytics.popularCategory,
          recentUploads: analytics.recentUploads.length,
          storageUsed: analytics.storageUsed
        };

        this.recentWallpapers = analytics.recentUploads;
        this.prepareCategoryStats(wallpapers, categories);

        // Latest 4 upload activities
        this.recentActivities = activities
          .filter(act => act.type === 'upload')
          .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
          .slice(0, 4);

        // Add system activity at top
        this.recentActivities.unshift({
          action: 'System started',
          details: 'Admin dashboard initialized',
          time: 'Just now',
          type: 'system'
        });

        this.isLoading = false;
        this.dataLoaded = true;
      },
      error: (error) => {
        console.error('Dashboard load error:', error);
        this.isLoading = false;
        this.loadSampleData();
      }
    });
  }

  // Increment download
  incrementDownload(wallpaper: any) {
    this.apiService.incrementDownload(wallpaper.id).subscribe({
      next: () => {
        wallpaper.downloads = (wallpaper.downloads || 0) + 1;
        this.dashboardStats.totalDownloads += 1;
      },
      error: err => console.error('Download increment error:', err)
    });
  }

  
  // Increment like
  incrementLike(wallpaper: any) {
    this.apiService.incrementLike(wallpaper.id).subscribe({
      next: () => {
        wallpaper.likes = (wallpaper.likes || 0) + 1;
        this.dashboardStats.totalLikes += 1;
      },
      error: err => console.error('Like increment error:', err)
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  isTabActive(tab: string): boolean {
    return this.activeTab === tab;
  }

  private calculateStats(wallpapers: any[], categories: any[]) {
    const totalDownloads = wallpapers.reduce((sum, wp) => sum + (wp.downloads || 0), 0);
    const totalLikes = wallpapers.reduce((sum, wp) => sum + (wp.likes || 0), 0);

    const categoryCounts: {[key: string]: number} = {};
    wallpapers.forEach(wp => {
      categoryCounts[wp.category] = (categoryCounts[wp.category] || 0) + 1;
    });

    const popularCategory = Object.keys(categoryCounts).reduce((a, b) =>
      categoryCounts[a] > categoryCounts[b] ? a : b, 'Nature'
    );

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentUploads = wallpapers.filter(wp => {
      const uploadDate = wp.uploadDate || wp.createdAt;
      return uploadDate ? new Date(uploadDate) > oneWeekAgo : false;
    }).length;

    const storageMB = (wallpapers.length * 2).toFixed(1);

    this.dashboardStats = {
      totalWallpapers: wallpapers.length,
      totalCategories: categories.length,
      totalDownloads,
      totalLikes,
      popularCategory,
      recentUploads,
      storageUsed: `${storageMB} MB`
    };
  }

  private prepareRecentWallpapers(wallpapers: any[]) {
    this.recentWallpapers = wallpapers
      .sort((a, b) => (b.id || 0) - (a.id || 0))
      .slice(0, 4)
      .map(wp => ({
        ...wp,
        displayTitle: wp.title.length > 20 ? wp.title.substring(0, 20) + '...' : wp.title
      }));
  }

  private prepareCategoryStats(wallpapers: any[], categories: any[]) {
    const categoryCounts: {[key: string]: number} = {};
    wallpapers.forEach(wp => {
      categoryCounts[wp.category] = (categoryCounts[wp.category] || 0) + 1;
    });

    this.categoryStats = categories.map(cat => ({
      name: cat.name,
      count: categoryCounts[cat.name] || 0,
      primary: cat.primary,
      secondary: cat.secondary,
      icon: this.getCategoryIcon(cat.name)
    })).sort((a, b) => b.count - a.count).slice(0, 6);
  }

  private getCategoryIcon(category: string): string {
    const icons: {[key: string]: string} = {
      'Nature': '🌿', 'Space': '🚀', 'Abstract': '🎨', 'Animals': '🐾',
      'Cities': '🏙️', 'Travel': '✈️', 'Technology': '💻', 'Food': '🍕',
      'Sports': '⚽', 'Music': '🎵', 'Art': '🖼️', 'Cars': '🚗',
      'Fashion': '👗', 'History': '🏛️', 'Movies': '🎬'
    };
    return icons[category] || '📁';
  }

  private loadSampleData() {
    this.dashboardStats = {
      totalWallpapers: 0,
      totalCategories: 15,
      totalDownloads: 0,
      totalLikes: 0,
      popularCategory: 'Nature',
      recentUploads: 0,
      storageUsed: '0 MB'
    };

    this.recentWallpapers = [];
    this.categoryStats = [];
    this.recentActivities = [
      { action: 'Backend connected', details: 'API is responding', time: 'Just now', type: 'system' }
    ];
  }

  logout() {
    this.authService.logout();
  }

  getActivityIcon(type: string): string {
    const icons: {[key: string]: string} = { upload: '🖼️', system: '⚙️', user: '👤' };
    return icons[type] || '📝';
  }
}
