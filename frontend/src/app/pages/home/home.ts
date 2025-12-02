import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';
import { SettingsService } from '../../services/settings';
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
  @ViewChild('carousel') carousel!: ElementRef<HTMLDivElement>;

  heroImages: string[] = [
    'https://loremflickr.com/1600/600/landscape?lock=1',
    'https://loremflickr.com/1600/600/nature?lock=2',
    'https://loremflickr.com/1600/600/city?lock=3',
  ];
  currentHeroIndex = 0;
  heroBackground = this.heroImages[0];

  layout: 'grid' | 'masonry' | 'carousel' = 'grid'; // default

  constructor(
    private api: ApiService,
    private router: Router,
    private settingsService: SettingsService
  ) {}

  ngOnInit() {
    // 1️⃣ Load layout from settings
    this.settingsService.getSettings().subscribe({
      next: (settings: any) => {
        if (settings.defaultLayout) {
          this.layout = settings.defaultLayout;
        }
      },
      error: (err) => console.error('Failed to load settings:', err)
    });

    // 2️⃣ Load categories
    this.api.getCategories().subscribe({ next: (data) => (this.categories = data) });

    // 3️⃣ Load wallpapers
    this.api.getWallpapers().subscribe({
      next: (data) => {
        this.wallpapers = data;
        this.filteredWallpapers = [...data];
      },
    });

    // 4️⃣ Listen for navbar search
    window.addEventListener('search-wallpapers', (event: any) => {
      const keyword = event.detail.trim().toLowerCase();
      if (!keyword) {
        this.filteredWallpapers = [...this.wallpapers];
        return;
      }
      this.filteredWallpapers = this.wallpapers.filter(
        (w) =>
          w.title.toLowerCase().includes(keyword) ||
          w.category.toLowerCase().includes(keyword)
      );
    });

    // 5️⃣ Rotate hero background every 5 seconds
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
   scrollCarousel(direction: number) {
  if (!this.carousel) return;
  const el = this.carousel.nativeElement;
  const itemWidth = el.querySelector('.carousel-item')?.clientWidth || 300;
  const gap = 16; // gap in px between items
  el.scrollBy({ left: direction * (itemWidth + gap), behavior: 'smooth' });
}

}
