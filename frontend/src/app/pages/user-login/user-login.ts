import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuth } from '../../services/user-auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.html',
  styleUrl: './user-login.scss',
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {
  mode: 'login' | 'register' = 'login';
  name = '';
  email = '';
  password = '';
  isLoading = false;
  message = { text: '', type: '' };

  constructor(private auth: UserAuth, private router: Router) {}

  switchMode() {
    this.mode = this.mode === 'login' ? 'register' : 'login';
    this.message = { text: '', type: '' };
  }

  submit() {
    if (!this.email || !this.password || (this.mode === 'register' && !this.name)) {
      this.showMessage('Please fill in all fields', 'error');
      return;
    }

    this.isLoading = true;
    this.message = { text: '', type: '' };

    if (this.mode === 'login') {
      this.auth.login(this.email, this.password).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.isLoading = false;
          this.showMessage('Invalid email or password', 'error');
          console.error('Login error:', error);
        }
      });
    } else {
      const payload = {
        name: this.name,
        email: this.email,
        password: this.password
      };

      this.auth.register(payload).subscribe({
        next: () => {
          this.isLoading = false;
          this.showMessage('Registration successful! Please login.', 'success');
          setTimeout(() => {
            this.switchMode();
          }, 1500);
        },
        error: (error) => {
          this.isLoading = false;
          this.showMessage('Registration failed. Please try again.', 'error');
          console.error('Registration error:', error);
        }
      });
    }
  }

  private showMessage(text: string, type: 'success' | 'error') {
    this.message = { text, type };
  }
}