import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.scss'
})
export class AdminSidebar {
  
  menuItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/wallpapers', icon: '🖼️', label: 'Wallpapers' },
    { path: '/admin/users', icon: '👥', label: 'Users' },
    { path: '/admin/categories', icon: '📁', label: 'Categories' },
    { path: '/admin/settings', icon: '⚙️', label: 'Settings' }
  ];

  constructor(public authService: Auth,     private router: Router
) {}
 isActive(path: string): boolean {
    return this.router.url === path || this.router.url.startsWith(path + '/');
  }
  logout() {
    this.authService.logout();
  }
}