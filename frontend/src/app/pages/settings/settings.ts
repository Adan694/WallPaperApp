import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { AdminSidebar } from '../../components/admin-sidebar/admin-sidebar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './settings.html',
  styleUrls: ['./settings.scss'], 
  imports: [AdminSidebar, CommonModule, FormsModule]
})
export class Settings implements OnInit {
  // Active tab
  activeTab: string = 'general';

  // Example data for select options
  languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
  ];

  categories = [
    { name: 'Nature' },
    { name: 'Abstract' },
    { name: 'Technology' },
    { name: 'Space' }
  ];

  // Settings model
  settings = {
    siteName: '',
    siteDescription: '',
    siteLogo: null as File | null,
    defaultLanguage: 'en',
    allowedFileTypes: 'jpg,png,webp',
    maxUploadSize: 10,
    defaultCategory: 'Nature',
    autoApproveUploads: false,
    enableUserUploads: true,
    passwordPolicy: '',
    enable2FA: false,
    rolesPermissions: '',
    defaultTheme: 'light',
    defaultLayout: 'grid',
    categoryColor: '#ff0000',
    sessionTimeout: 30,
    maintenanceMode: false,
    ipWhitelist: ''
  };

  constructor(public authService: Auth, private router: Router) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  // Tab switching
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // Logout
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Load existing settings (placeholder)
  loadSettings() {
    // Here you would call your API to fetch settings
    // Example: this.settings = await settingsService.getSettings();
    console.log('Loading settings...');
  }

  // Save settings
  saveSettings() {
    // Here you would call your API to save settings
    // Example: settingsService.saveSettings(this.settings);
    console.log('Saving settings...', this.settings);
  }

  // Logo upload handler
  onLogoUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.settings.siteLogo = input.files[0];
      console.log('Logo selected:', this.settings.siteLogo.name);
    }
  }

  // Backup & restore functions
  backupDatabase() {
    console.log('Backing up database...');
    // call your backup service
  }

  backupMedia() {
    console.log('Backing up media...');
    // call your backup service
  }

  restoreBackup() {
    console.log('Restoring backup...');
    // call your restore service
  }
}
