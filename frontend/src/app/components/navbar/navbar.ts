import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

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
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  categories: Category[] = [];

  constructor(private api: ApiService, private router: Router) {}

  async ngOnInit() {
    this.categories = await this.api.getCategories() || [];
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


}
