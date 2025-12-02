import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserAuth } from '../../services/user-auth';
import { SettingsService } from '../../services/settings';

interface Category {
  id: number;
  name: string;
  primary: string;
  secondary: string;
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class Navbar implements OnInit {
  categories: Category[] = [];
  isLoggedIn = false;

  // Site settings
  siteName = 'WallPaperApp';
siteLogoUrl = '';

  constructor(
    private api: ApiService,
    private router: Router,
    private auth: UserAuth,
    private settingsService: SettingsService
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.checkLogin();
    this.loadSettings();
  }

  loadCategories() {
    this.api.getCategories().subscribe({
      next: (data: Category[]) => (this.categories = data),
      error: (err) => {
        console.error('Failed to load categories:', err);
        this.categories = [];
      },
    });
  }

  loadSettings() {
  this.settingsService.getSettings().subscribe({
    next: (data: any) => {
      if (data.siteName) this.siteName = data.siteName;
if (data.siteLogoUrl) this.siteLogoUrl = data.siteLogoUrl; // use as-is
    },
    error: (err) => console.error('Failed to load settings:', err),
  });
}

  searchWallpaper(keyword: string) {
    if (!keyword) return;
    window.dispatchEvent(new CustomEvent('search-wallpapers', { detail: keyword }));
  }

  goToCategory(categoryName: string) {
    this.router.navigate(['/category', categoryName]);
  }

  searchTimeout: any;
  liveSearch(keyword: string) {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('search-wallpapers', { detail: keyword }));
    }, 300);
  }

  checkLogin() {
    this.isLoggedIn = this.auth.isLoggedIn();
  }

  logout() {
    this.auth.logout();
    this.isLoggedIn = false;
  }
}
