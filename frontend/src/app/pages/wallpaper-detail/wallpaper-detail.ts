import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-wallpaper-detail',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './wallpaper-detail.html',
  styleUrls: ['./wallpaper-detail.scss']
})
export class WallpaperDetail implements OnInit {
  wallpaper: any = null;
  isLoading = true;
  favorites: any[] = [];
categoryColors: { [key: string]: string } = {
  'Nature': '#E8F5E9',
  'Space': '#E3F2FD',
  'Abstract': '#FBE9E7'
};

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.wallpaper = await this.api.getWallpaperById(id);
    }
    this.isLoading = false;

    // Load favorites from localStorage
    const storedFavs = localStorage.getItem('favorites');
    if (storedFavs) this.favorites = JSON.parse(storedFavs);
  }

  downloadWallpaper() {
  if (!this.wallpaper) return;

  // Fetch the image as blob
  fetch(this.wallpaper.imageUrl)
    .then(res => res.blob())
    .then(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${this.wallpaper.title}.jpg`;
      a.click();
      URL.revokeObjectURL(a.href);
    })
    .catch(err => console.error('Download error:', err));
}

get bgColor(): string {
  if (!this.wallpaper) return '#fff';
  return this.categoryColors[this.wallpaper.category] || '#fff'; // fallback white
}


  /** Add wallpaper to favorites (stored locally) */
  addToFavorites() {
    const exists = this.favorites.find((f) => f.id === this.wallpaper.id);
    if (exists) {
      alert('Already added to favorites ❤️');
      return;
    }

    this.favorites.push(this.wallpaper);
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
    alert('Added to favorites! ⭐');
  }
}
