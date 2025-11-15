import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Modal } from '../../components/modal/modal';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, Navbar, Modal],
  templateUrl: './favorites.html',
  styleUrls: ['./favorites.scss']
})
export class Favorites implements OnInit {
  favorites: any[] = [];
filteredFavorites: any[] = []; // NEW

  showModal = false;
  selectedId: number | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadFavorites();
    window.addEventListener('storage', () => this.loadFavorites());
    window.addEventListener('search-wallpapers', (event: any) => {
    const keyword = event.detail.trim().toLowerCase();

    if (!keyword) {
      // Reset when search is empty
      this.filteredFavorites = [...this.favorites];
      return;
    }

    // Filter favorites by title or category
    this.filteredFavorites = this.favorites.filter(
      f =>
        f.title.toLowerCase().includes(keyword) ||
        f.category.toLowerCase().includes(keyword)
    );
  });
  }

  loadFavorites() {
  const stored = localStorage.getItem('favorites');
  this.favorites = stored ? JSON.parse(stored) : [];
  this.filteredFavorites = [...this.favorites]; // NEW
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

  this.favorites = this.favorites.filter(f => f.id !== id);
  localStorage.setItem('favorites', JSON.stringify(this.favorites));

  // Update filtered list as well
  this.filteredFavorites = this.filteredFavorites.filter(f => f.id !== id);

  this.closeModal();
}

}
