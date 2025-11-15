import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { forkJoin } from 'rxjs';
import { Auth } from '../../services/auth';
import { AdminSidebar } from '../../components/admin-sidebar/admin-sidebar';

@Component({
  selector: 'app-admin-wallpapers',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AdminSidebar],
  templateUrl: './admin-wallpapers.html',
  styleUrl: './admin-wallpapers.scss'
})
export class AdminWallpapers implements OnInit {
  wallpapers: any[] = [];
  categories: any[] = [];
  filteredWallpapers: any[] = [];
  
  // Search and filter
  searchTerm: string = '';
  selectedCategory: string = 'all';
  sortBy: string = 'newest';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 12;
  totalPages: number = 1;
  
  // Modal states
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  
  // Form data
  newWallpaper = {
    title: '',
    category: '',
    imageUrl: '',
    description: ''
  };
  
  selectedWallpaper: any = null;
  
  isLoading: boolean = true;
  isSubmitting: boolean = false;

  constructor(
    public authService: Auth,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    
    forkJoin({
      wallpapers: this.apiService.getWallpapers(),
      categories: this.apiService.getCategories()
    }).subscribe({
      next: ({ wallpapers, categories }) => {
        this.wallpapers = wallpapers;
        this.categories = categories;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    let filtered = [...this.wallpapers];

    // Apply search filter
    if (this.searchTerm) {
      filtered = filtered.filter(wp => 
        wp.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        wp.category.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(wp => wp.category === this.selectedCategory);
    }

    // Apply sorting
    switch (this.sortBy) {
      case 'newest':
        filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
      case 'oldest':
        filtered.sort((a, b) => (a.id || 0) - (b.id || 0));
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'category':
        filtered.sort((a, b) => a.category.localeCompare(b.category));
        break;
    }

    this.filteredWallpapers = filtered;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredWallpapers.length / this.itemsPerPage);
    this.currentPage = Math.max(1, Math.min(this.currentPage, this.totalPages));
  }

  get paginatedWallpapers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredWallpapers.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Search and filter methods
  onSearch() {
    this.currentPage = 1;
    this.applyFilters();
  }

  onCategoryChange() {
    this.currentPage = 1;
    this.applyFilters();
  }

  onSortChange() {
    this.applyFilters();
  }

  // Pagination methods
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  // Modal methods
  openAddModal() {
    this.newWallpaper = {
      title: '',
      category: this.categories[0]?.name || '',
      imageUrl: '',
      description: ''
    };
    this.showAddModal = true;
  }

  openEditModal(wallpaper: any) {
    this.selectedWallpaper = { ...wallpaper };
    this.showEditModal = true;
  }

  openDeleteModal(wallpaper: any) {
    this.selectedWallpaper = wallpaper;
    this.showDeleteModal = true;
  }

  closeModals() {
    this.showAddModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.selectedWallpaper = null;
    this.isSubmitting = false;
  }

  // CRUD Operations
  addWallpaper() {
    if (!this.newWallpaper.title || !this.newWallpaper.category || !this.newWallpaper.imageUrl) {
      alert('Please fill in all required fields');
      return;
    }

    this.isSubmitting = true;
    
    // Simulate API call - in real app, you'd call your backend
    setTimeout(() => {
      const newId = Math.max(...this.wallpapers.map(w => w.id)) + 1;
      const wallpaper = {
        id: newId,
        ...this.newWallpaper,
        downloads: 0,
        likes: 0,
        uploadDate: new Date().toISOString()
      };
      
      this.wallpapers.unshift(wallpaper);
      this.applyFilters();
      this.closeModals();
      this.isSubmitting = false;
    }, 1000);
  }

  updateWallpaper() {
    if (!this.selectedWallpaper.title || !this.selectedWallpaper.category || !this.selectedWallpaper.imageUrl) {
      alert('Please fill in all required fields');
      return;
    }

    this.isSubmitting = true;
    
    // Simulate API call
    setTimeout(() => {
      const index = this.wallpapers.findIndex(w => w.id === this.selectedWallpaper.id);
      if (index !== -1) {
        this.wallpapers[index] = { ...this.selectedWallpaper };
        this.applyFilters();
        this.closeModals();
      }
      this.isSubmitting = false;
    }, 1000);
  }

  deleteWallpaper() {
    this.isSubmitting = true;
    
    // Simulate API call
    setTimeout(() => {
      this.wallpapers = this.wallpapers.filter(w => w.id !== this.selectedWallpaper.id);
      this.applyFilters();
      this.closeModals();
      this.isSubmitting = false;
    }, 1000);
  }

  // Utility methods
  getCategoryColor(categoryName: string) {
    const category = this.categories.find(cat => cat.name === categoryName);
    return category ? category.primary : '#667eea';
  }

  getCategoryIcon(categoryName: string): string {
    const icons: {[key: string]: string} = {
      'Nature': '🌿',
      'Space': '🚀',
      'Abstract': '🎨',
      'Animals': '🐾',
      'Cities': '🏙️',
      'Travel': '✈️',
      'Technology': '💻',
      'Food': '🍕',
      'Sports': '⚽',
      'Music': '🎵',
      'Art': '🖼️',
      'Cars': '🚗',
      'Fashion': '👗',
      'History': '🏛️',
      'Movies': '🎬'
    };
    return icons[categoryName] || '📁';
  }

  logout() {
    this.authService.logout();
  }
}