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
  
  showModal = false;
  selectedId: number | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadFavorites();
    window.addEventListener('storage', () => this.loadFavorites());
  }

  loadFavorites() {
    const stored = localStorage.getItem('favorites');
    this.favorites = stored ? JSON.parse(stored) : [];
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
    this.closeModal();
  }
}
