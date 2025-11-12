import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';

interface Category {
  id: number;
  name: string;
  primary: string;
  secondary: string;
}

interface Wallpaper {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  imports: [FormsModule, CommonModule, Navbar],
})
export class Home implements OnInit {
  categories: Category[] = [];
  wallpapers: Wallpaper[] = [];
  filteredWallpapers: Wallpaper[] = [];

  heroImages: string[] = [
    'https://picsum.photos/1600/600?blur=3',
    'https://picsum.photos/1600/600?blur=5',
    'https://picsum.photos/1600/600?blur=7',
  ];
  currentHeroIndex = 0;
  heroBackground = this.heroImages[0];

  constructor(private api: ApiService, private router: Router) {}

  async ngOnInit() {
    this.categories = (await this.api.getCategories()) || [];
    this.wallpapers = (await this.api.getWallpapers()) || [];
    this.filteredWallpapers = [...this.wallpapers];

    // Listen for search events from navbar
    window.addEventListener('search-wallpapers', (event: any) => {
      const keyword = event.detail.trim().toLowerCase();

      if (!keyword) {
        // reset when search is empty
        this.filteredWallpapers = [...this.wallpapers];
        return;
      }

      this.filteredWallpapers = this.wallpapers.filter(
        (w) =>
          w.title.toLowerCase().includes(keyword) ||
          w.category.toLowerCase().includes(keyword)
      );
    });

    // Rotate hero background every 5 seconds
    setInterval(() => {
      this.currentHeroIndex = (this.currentHeroIndex + 1) % this.heroImages.length;
      this.heroBackground = this.heroImages[this.currentHeroIndex];
    }, 5000);
  }

  selectCategory(name: string) {
    this.router.navigate(['/category', name]);
  }

  goToWallpaper(id: number) {
    this.router.navigate(['/wallpaper', id]);
  }
}
