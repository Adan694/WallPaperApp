import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private currentUser: any = null;

  login(email: string, password: string): boolean {
    const adminUsers = [
      { email: 'admin@wallpapers.com', password: 'admin123', role: 'admin' },
      { email: 'admin@example.com', password: 'password', role: 'admin' }
    ];

    const user = adminUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      this.currentUser = {
        id: 1,
        email: user.email,
        role: user.role,
        name: 'Administrator'
      };
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        localStorage.setItem('authToken', 'FAKE_ADMIN_JWT_TOKEN');
      
      return true;
    }
    
    return false;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    this.router.navigate(['/admin/login']);
  }

  isLoggedIn(): boolean {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser = JSON.parse(user);
    }
    return !!this.currentUser;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  getCurrentUser() {
    return this.currentUser;
  }

  constructor(private router: Router) {
    this.isLoggedIn(); // Check existing session
  }
}