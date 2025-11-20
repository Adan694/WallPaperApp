
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';
import { AdminSidebar } from '../../components/admin-sidebar/admin-sidebar';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebar],
  templateUrl: './admin-categories.html',
  styleUrl: './admin-categories.scss'
})
export class AdminCategories implements OnInit {
  categories: any[] = [];
  showAddModal = false;
  showEditModal = false;
  newCategory = { name: '' };
  selectedCategory: any = null;
  isSubmitting = false;

  constructor(private apiService: ApiService,     public authService: Auth) {}

  ngOnInit() {
    this.loadCategories();
  }
  
loadCategories() {
  this.apiService.getCategories().subscribe({
    next: (data) => {
      this.categories = data;
      console.log("Loaded categories:", data);
    },
    error: (err) => console.error("Error loading categories", err)
  });
}


  // --- Modals ---
  openAddModal() {
    this.newCategory = { name: '' };
    this.showAddModal = true;
  }

  openEditModal(category: any) {
    this.selectedCategory = { ...category };
    this.showEditModal = true;
  }

  closeModals() {
    this.showAddModal = false;
    this.showEditModal = false;
    this.isSubmitting = false;
    this.selectedCategory = null;
  }

  // --- CRUD Operations ---
 addCategory() {
  if (!this.newCategory.name) return alert('Name is required');

  this.isSubmitting = true;

  // Map frontend field to backend
  // Map frontend field to backend
const payload = {
  Name: this.newCategory.name,
  SecondaryColor: '' // optional
};

this.apiService.addCategory(payload).subscribe({
  next: (res: any) => {
    console.log('Response from backend after add:', res);

    // Map backend response to frontend-friendly keys
    const mapped = {
      id: res.id,
      name: res.name,
      secondary: res.SecondaryColor  // <- optional
    };

    console.log('Mapped category object:', mapped);
    this.categories.push(mapped);
    console.log('Categories after push:', this.categories);
    this.closeModals();
  },
  error: () => alert('Error adding category')
});

}

updateCategory() {
  if (!this.selectedCategory.name) return alert('Name is required');

  this.isSubmitting = true;
  this.apiService.updateCategory(this.selectedCategory.id, this.selectedCategory)
    .subscribe({
      next: (res: any) => {
        console.log('Response from backend after update:', res);

        const mapped = {
          id: res.id,
          name: res.name,
          secondary: res.secondary || res.SecondaryColor
        };

        console.log('Mapped updated category:', mapped);

        const index = this.categories.findIndex(c => c.id === mapped.id);
        this.categories[index] = mapped;
        console.log('Categories after update:', this.categories);

        this.closeModals();
      },
      error: (err) => {
        console.error('Error updating category:', err);
        alert('Error updating category');
      }
    });
}

  deleteCategory(category: any) {
    if (!confirm(`Delete category "${category.name}"?`)) return;

    this.apiService.deleteCategory(category.id).subscribe({
      next: () => this.categories = this.categories.filter(c => c.id !== category.id),
      error: () => alert('Error deleting category')
    });
  }
   logout() {
    this.authService.logout();
  }
}
