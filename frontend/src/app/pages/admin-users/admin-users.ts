import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
import { Navbar } from '../../components/navbar/navbar';
import { Toast } from '../../components/toast/toast';
import { AdminSidebar } from '../../components/admin-sidebar/admin-sidebar';
import { Modal } from '../../components/modal/modal';
import { Auth } from '../../services/auth';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, AdminSidebar, Toast, Modal],
  templateUrl: './admin-users.html',
  styleUrls: ['./admin-users.scss']
})
export class AdminUsers implements OnInit {
  users: User[] = [];
  isLoading = true;
  toastMessage = '';
  toastType: 'success' | 'error' | 'info' = 'info';

  // Modal state
  isModalOpen = false;
  modalTitle = '';
  modalMessage = '';
  modalAction: (() => void) | null = null;

  constructor(private api: ApiService,     public authService: Auth) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.api.getAdminUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.showToast('Failed to load users', 'error');
        console.error(err);
        this.isLoading = false;
      }
    });
  }

   logout() {
    this.authService.logout();
  }
  showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toastMessage = message;
    this.toastType = type;
    setTimeout(() => (this.toastMessage = ''), 3000);
  }

  // --- Modal Handlers ---
  openModal(title: string, message: string, action: () => void) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalAction = action;
    this.isModalOpen = true;
  }

  onModalConfirm() {
    if (this.modalAction) this.modalAction();
    this.isModalOpen = false;
  }

  onModalClose() {
    this.isModalOpen = false;
  }

  // --- User Actions ---
  deleteUser(userId: number) {
    this.openModal(
      'Delete User',
      'Are you sure you want to delete this user?',
      async () => {
        try {
          await this.api.deleteUser(userId).toPromise();
          this.users = this.users.filter(u => u.id !== userId);
          this.showToast('User deleted successfully', 'success');
        } catch (err: any) {
          this.showToast('Failed to delete user', 'error');
        }
      }
    );
  }

  changeRole(userId: number, role: string) {
    this.openModal(
      'Change Role',
      `Are you sure you want to change this user's role to ${role}?`,
      async () => {
        try {
          await this.api.changeUserRole(userId, role).toPromise();
          const user = this.users.find(u => u.id === userId);
          if (user) user.role = role;
          this.showToast('Role updated successfully', 'success');
        } catch (err: any) {
          this.showToast('Failed to update role', 'error');
        }
      }
    );
  }
}
