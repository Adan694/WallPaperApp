import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { Modal } from '../../components/modal/modal';
import { Toast } from '../../components/toast/toast';

@Component({
  selector: 'app-wallpaper-detail',
  standalone: true,
  imports: [CommonModule, Navbar, Modal, Toast],
  templateUrl: './wallpaper-detail.html',
  styleUrls: ['./wallpaper-detail.scss']
})
export class WallpaperDetail implements OnInit {
  wallpaper: any = null;
  isLoading = true;
  favorites: any[] = [];
  bgLoaded = false;
  showModal = false;
  selectedId: number | null = null;
  toastMessage = '';
  toastType: 'success' | 'error' | 'info' = 'info';

showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  this.toastMessage = message;
  this.toastType = type;

  setTimeout(() => {
    this.toastMessage = '';
  }, 3000);
}

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
        setTimeout(() => this.bgLoaded = true, 100); // ADD THIS

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

  /** Add wallpaper to favorites (stored locally) */
  addToFavorites() {
  if (!this.wallpaper) return;

  const exists = this.favorites.find(f => f.id === this.wallpaper.id);
  if (exists) {
    alert('Already added to favorites ');
    return;
  }

  this.favorites.push(this.wallpaper);
  localStorage.setItem('favorites', JSON.stringify(this.favorites));
this.showToast('Added to favorites! ⭐', 'success');
}


  isSharing = false; // add this to your component

async share() {
  if (!this.wallpaper || this.isSharing) return; // prevent double clicks

  this.isSharing = true; // mark sharing in progress
  try {
    const response = await fetch(this.wallpaper.imageUrl);
    const blob = await response.blob();
    const file = new File([blob], `${this.wallpaper.title}.jpg`, { type: blob.type });

    const shareData: any = {
      title: this.wallpaper.title,
      text: `Check out this wallpaper: ${this.wallpaper.title}`,
      files: [file]
    };

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share(shareData);
      console.log('Shared successfully!');
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Your browser does not support sharing images. Link copied instead! 📋');
    }
  } catch (err: any) {
    console.error('Share failed:', err);
    alert(`Share failed: ${err.message}`);
  } finally {
    this.isSharing = false; // reset sharing state
  }
}
isFavorite(): boolean {
  if (!this.wallpaper) return false;
  return this.favorites.some(f => f.id === this.wallpaper.id);
}
// removeFromFavorites() {
//   if (!this.wallpaper) return;

//   this.favorites = this.favorites.filter(f => f.id !== this.wallpaper.id);
//   localStorage.setItem('favorites', JSON.stringify(this.favorites));
//   alert('Removed from favorites ');
// }

openModal() {
  this.showModal = true;
}

closeModal() {
  this.showModal = false;
}

removeFromFavorites() {
  if (!this.wallpaper) return;

  // Remove from favorites array
  this.favorites = this.favorites.filter(f => f.id !== this.wallpaper.id);
  localStorage.setItem('favorites', JSON.stringify(this.favorites));

this.showToast('Removed from favorites ', 'error');
}


}
