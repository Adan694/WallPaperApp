import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { AdminSidebar } from '../../components/admin-sidebar/admin-sidebar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../services/settings';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './settings.html',
  styleUrls: ['./settings.scss'], 
  imports: [AdminSidebar, CommonModule, FormsModule]
})
export class AdminSettings implements OnInit {
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

  constructor(public authService: Auth, private router: Router, private settingsService: SettingsService  ) {}

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

  loadSettings() {
  this.settingsService.getSettings().subscribe({
    next: (data: any) => {
      this.settings = {
        ...this.settings,
        ...data,
        siteLogo: null  // avoid loading base64 / file
      };
    },
    error: (err) => console.error('Failed to load settings:', err)
  });
}

saveSettings() {
  const fd = new FormData();

Object.keys(this.settings).forEach((key) => {
  if (key === "siteLogo" || key === "siteLogoUrl") return;

  const value = (this.settings as any)[key];

  // Convert all non-files to strings
  fd.append(key, value !== null ? String(value) : "");
});



  if (this.settings.siteLogo) {
fd.append("file", this.settings.siteLogo!);
  }

  this.settingsService.updateSettings(fd).subscribe({
    next: () => alert("Settings saved successfully!"),
    error: (err) => console.error("Failed to save settings:", err)
  });
}


onLogoUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    this.settings.siteLogo = file;  
  }
}


  // Backup & restore functions
  backupDatabase() {
    console.log('Backing up database...');
  }

  backupMedia() {
    console.log('Backing up media...');
  }

  restoreBackup() {
    console.log('Restoring backup...');
  }
}
