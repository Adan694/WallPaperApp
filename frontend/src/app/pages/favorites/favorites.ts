import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Modal } from '../../components/modal/modal';
import { UserAuth } from '../../services/user-auth';

interface FavoriteWallpaper {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  userEmail: string;
}

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, Navbar, Modal, RouterLink],
  templateUrl: './favorites.html',
  styleUrls: ['./favorites.scss']
})
export class Favorites implements OnInit {
  favorites: FavoriteWallpaper[] = [];
  filteredFavorites: FavoriteWallpaper[] = [];

  showModal = false;
  selectedId: number | null = null;

  constructor(private router: Router, private auth: UserAuth) {}

  ngOnInit() {
    this.loadFavorites();

    window.addEventListener('storage', () => this.loadFavorites());
    window.addEventListener('search-wallpapers', (event: any) => {
      const keyword = event.detail.trim().toLowerCase();

      if (!keyword) {
        this.filteredFavorites = [...this.favorites];
        return;
      }

      this.filteredFavorites = this.favorites.filter(
        (f: FavoriteWallpaper) =>
          f.title.toLowerCase().includes(keyword) ||
          f.category.toLowerCase().includes(keyword)
      );
    });
  }

 // In both wallpaperdetail.ts and favorites.ts
loadFavorites() {
  const user = this.auth.getUser();
  
  console.log('Current user:', user);
  
  if (!user || typeof user !== 'object' || !user.email) {
    console.log('No valid user found, clearing favorites');
    this.favorites = [];
    this.filteredFavorites = []; // ← Make sure to clear this too
    return;
  }

  const key = `favorites_${user.email}`;
  console.log('Using storage key:', key);
  
  const stored = localStorage.getItem(key);
  this.favorites = stored ? JSON.parse(stored) : [];
  this.filteredFavorites = [...this.favorites]; // ← Initialize filteredFavorites
  
  console.log('Loaded favorites:', this.favorites);
  console.log('Filtered favorites:', this.filteredFavorites);
}

  viewWallpaper(id: number) {
    this.router.navigate(['/wallpaper', id]);
  }

  openModal(id: number) {
    this.selectedId = id;
    this.showModal = true;
  }

  closeModal() {
    this.selectedId = null;
    this.showModal = false;
  }
removeFromFavorites(id: number | null) {
  if (id === null) return;

  const user = this.auth.getUser();
  if (!user) return;

  // 1️⃣ Read the current user's favorites from localStorage
  const key = `favorites_${user.email}`;
  let stored = localStorage.getItem(key);
  let userFavorites: FavoriteWallpaper[] = stored ? JSON.parse(stored) : [];

  // 2️⃣ Filter out the wallpaper to remove
  userFavorites = userFavorites.filter(f => f.id !== id);

  // 3️⃣ Save back to localStorage
  localStorage.setItem(key, JSON.stringify(userFavorites));

  // 4️⃣ Update in-memory lists
  this.favorites = [...userFavorites];
  this.filteredFavorites = [...userFavorites];

  this.closeModal();
}


}
