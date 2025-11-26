import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { Modal } from '../../components/modal/modal';
import { Toast } from '../../components/toast/toast';
import { UserAuth } from '../../services/user-auth';
import { LikeButton } from '../../components/likebutton/likebutton';

interface FavoriteWallpaper {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  userEmail: string;
    likes: string[]; // ✅ add this

}

@Component({
  selector: 'app-wallpaper-detail',
  standalone: true,
  imports: [CommonModule, Navbar, Modal, Toast, LikeButton],
  templateUrl: './wallpaper-detail.html',
  styleUrls: ['./wallpaper-detail.scss']
})
export class WallpaperDetail implements OnInit {
  wallpaper: FavoriteWallpaper | null = null;
  isLoading = true;
  favorites: FavoriteWallpaper[] = [];
  bgLoaded = false;
  showModal = false;
  selectedId: number | null = null;
  toastMessage = '';
  toastType: 'success' | 'error' | 'info' = 'info';

  categoryColors: { [key: string]: string } = {
    'Nature': '#E8F5E9',
    'Space': '#E3F2FD',
    'Abstract': '#FBE9E7'
  };

  isSharing = false;

  constructor(private route: ActivatedRoute, private api: ApiService, private auth: UserAuth) {}

  showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => this.toastMessage = '', 3000);
  }

ngOnInit() {
  const id = Number(this.route.snapshot.paramMap.get('id'));
  if (id) {
    this.api.getWallpaperById(id).subscribe({
      next: (wp: FavoriteWallpaper & { likes?: any }) => { // cast likes as any
        // Normalize likes to always be an array
        let likesArray: string[] = [];

        if (Array.isArray(wp.likes)) {
          likesArray = wp.likes;
        } else if (typeof wp.likes === 'string' && wp.likes.length > 0) {
          try {
            likesArray = JSON.parse(wp.likes);
          } catch {
            likesArray = [];
          }
        }

        this.wallpaper = { ...wp, likes: likesArray };
        setTimeout(() => (this.bgLoaded = true), 100);
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Failed to load wallpaper:", err);
        this.isLoading = false;
      }
    });
  }

  this.loadUserFavorites();
}



  /** Load favorites for the current logged-in user */
 // In both wallpaperdetail.ts and favorites.ts
loadUserFavorites() {
  const user = this.auth.getUser();
  
  // Debug logging
  console.log('Current user:', user);
  
  if (!user || typeof user !== 'object' || !user.email) {
    console.log('No valid user found, clearing favorites');
    this.favorites = [];
    return;
  }

  const key = `favorites_${user.email}`;
  console.log('Using storage key:', key);
  
  const stored = localStorage.getItem(key);
  this.favorites = stored ? JSON.parse(stored) : [];
  
  console.log('Loaded favorites:', this.favorites);
}

 downloadWallpaper() {
  if (!this.wallpaper) return;

  // Use backend endpoint which increments download count
  const url = `http://localhost:5000/api/wallpapers/download/${this.wallpaper.id}`;

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error('Download failed');
      return res.blob();
    })
    .then(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
a.download = `${this.wallpaper!.title}.jpg`;
      a.click();
      URL.revokeObjectURL(a.href);
    })
    .catch(err => console.error('Download error:', err));
}


 addToFavorites() {
  if (!this.wallpaper) return;
  const user = this.auth.getUser();
  if (!user) return alert('Please login first');

  const key = `favorites_${user.email}`;
  let userFavorites: FavoriteWallpaper[] = JSON.parse(localStorage.getItem(key) || '[]');

  const exists = userFavorites.find(f => f.id === this.wallpaper!.id);
  if (exists) {
    alert('Already added to favorites');
    return;
  }

  userFavorites.push({ ...this.wallpaper, userEmail: user.email });
  localStorage.setItem(key, JSON.stringify(userFavorites));

  // Update in-memory list to match current user's favorites
  this.favorites = [...userFavorites];

  this.showToast('Added to favorites! ⭐', 'success');
}

 removeFromFavorites() {
  if (!this.wallpaper) return;
  const user = this.auth.getUser();
  if (!user) return;

  const key = `favorites_${user.email}`;
  let userFavorites: FavoriteWallpaper[] = JSON.parse(localStorage.getItem(key) || '[]');

  userFavorites = userFavorites.filter(f => f.id !== this.wallpaper!.id);
  localStorage.setItem(key, JSON.stringify(userFavorites));

  this.favorites = [...userFavorites];

  this.showToast('Removed from favorites', 'error');
}

  isFavorite(): boolean {
    if (!this.wallpaper) return false;
    return this.favorites.some(f => f.id === this.wallpaper!.id);
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  async share() {
    if (!this.wallpaper || this.isSharing) return;
    this.isSharing = true;
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
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Your browser does not support sharing images. Link copied instead!');
      }
    } catch (err: any) {
      console.error('Share failed:', err);
      alert(`Share failed: ${err.message}`);
    } finally {
      this.isSharing = false;
    }
  }
}
