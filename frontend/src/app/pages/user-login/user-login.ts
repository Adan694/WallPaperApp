import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuth } from '../../services/user-auth';
import { SettingsService } from '../../services/settings';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.html',
  styleUrl: './user-login.scss',
  imports: [FormsModule, CommonModule]
})
export class LoginComponent implements OnInit {
  mode: 'login' | 'register' = 'login';
  name = '';
  email = '';
  password = '';
  isLoading = false;
  message = { text: '', type: '' };

  passwordPolicy: string = ''; // from backend
  passwordRegex: RegExp | null = null;

  constructor(private auth: UserAuth, private router: Router, private settingsService: SettingsService) {}

  ngOnInit(): void {
    // Load backend password policy
    this.settingsService.getSettings().subscribe({
  next: (data: any) => {
    console.log('Backend settings:', data);
    if (data.passwordPolicy) {
      this.passwordPolicy = data.passwordPolicy;
      try {
        // Remove leading/trailing slashes if present
        const pattern = this.passwordPolicy.replace(/^\/|\/$/g, '');
        this.passwordRegex = new RegExp(pattern);
        console.log('Password regex:', this.passwordRegex);
      } catch (err) {
        console.error('Invalid password policy regex:', err);
        this.passwordRegex = null;
      }
    }
  },
  error: (err) => console.error('Failed to load password policy:', err)
});

  }

  switchMode() {
    this.mode = this.mode === 'login' ? 'register' : 'login';
    this.message = { text: '', type: '' };
  }

  submit() {
    if (!this.email || !this.password || (this.mode === 'register' && !this.name)) {
      this.showMessage('Please fill in all fields', 'error');
      return;
    }

    // Validate password against backend policy
    if (this.mode === 'register' && this.passwordRegex && !this.passwordRegex.test(this.password)) {
      this.showMessage('Password does not meet the required policy', 'error');
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
