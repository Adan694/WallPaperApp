import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss'
})
export class AdminLogin {
  credentials = {
    email: '',
    password: ''
  };
  
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    if (!this.isValidEmail(this.credentials.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Simulate API call
    setTimeout(() => {
      const success = this.authService.login(
        this.credentials.email, 
        this.credentials.password
      );

      if (success) {
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.errorMessage = 'Invalid admin credentials. Please try again.';
      }
      
      this.isLoading = false;
    }, 1500);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onInputChange() {
    // Clear error when user starts typing again
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }
}