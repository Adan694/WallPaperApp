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
  
  // Form data - UPDATED TYPE DEFINITION
  newWallpaper = {
    title: '',
    category: '',
    imageUrl: '',
    description: '',
    imageFile: null as File | null,
    useFileUpload: false
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
      description: '',
      imageFile: null,
      useFileUpload: false
    };
    this.showAddModal = true;
  }

openEditModal(wallpaper: any) {
  this.selectedWallpaper = { 
    ...wallpaper,
    imageFile: null,        // Clear file selection
    imageUrl: wallpaper.imageUrl, // Pre-fill with current image URL
    useFileUpload: false
  };
  this.showEditModal = true;
  
  console.log('📝 Edit modal opened for:', wallpaper.title);
  console.log('Current image URL:', wallpaper.imageUrl);
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

  // File handling methods
 onFileSelected(event: any, isEdit: boolean = false) {
  const file = event.target.files[0];
  console.log('File selected:', file);
  
  if (file) {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, WebP, GIF)');
      event.target.value = ''; // Clear the file input
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      event.target.value = ''; // Clear the file input
      return;
    }

    if (isEdit && this.selectedWallpaper) {
      this.selectedWallpaper.imageFile = file;
      this.selectedWallpaper.useFileUpload = true;
      // Don't clear the URL - let the backend handle which one to use
    } else {
      this.newWallpaper.imageFile = file;
      this.newWallpaper.useFileUpload = true;
      // Don't clear the URL - let the backend handle which one to use
    }
    
    console.log('File assigned to form:', isEdit ? this.selectedWallpaper : this.newWallpaper);
  } else {
    console.log('No file selected');
  }
}
  clearFileSelection(isEdit: boolean = false) {
    if (isEdit && this.selectedWallpaper) {
      this.selectedWallpaper.imageFile = null;
      this.selectedWallpaper.useFileUpload = false;
    } else {
      this.newWallpaper.imageFile = null;
      this.newWallpaper.useFileUpload = false;
    }
  }

  // Add Wallpaper
  // addWallpaper() {
  //   if (!this.newWallpaper.title || !this.newWallpaper.category || 
  //       (!this.newWallpaper.imageUrl && !this.newWallpaper.imageFile)) {
  //     alert('Please fill in all required fields and provide either an image URL or file');
  //     return;
  //   }

  //   const categoryObj = this.categories.find(c => c.name === this.newWallpaper.category);
  //   if (!categoryObj) {
  //     alert('Invalid category');
  //     return;
  //   }

  //   // Prepare payload based on selection
  //   let payload: any;
    
  //   if (this.newWallpaper.imageFile) {
  //     // File upload - use FormData
  //     const formData = new FormData();
  //     formData.append('title', this.newWallpaper.title);
  //     formData.append('description', this.newWallpaper.description || '');
  //     formData.append('categoryId', categoryObj.id.toString());
  //     formData.append('imageFile', this.newWallpaper.imageFile);
      
  //     payload = formData;
  //   } else {
  //     // URL upload - use JSON
  //     payload = {
  //       title: this.newWallpaper.title,
  //       imageUrl: this.newWallpaper.imageUrl,
  //       description: this.newWallpaper.description,
  //       categoryId: categoryObj.id
  //     };
  //   }

  //   this.isSubmitting = true;

  //   this.apiService.addWallpaper(payload).subscribe({
  //     next: (response) => {
  //       this.wallpapers.unshift({
  //         id: response.id,
  //         title: response.title,
  //         description: response.description,
  //         imageUrl: response.imageUrl,
  //         category: categoryObj.name
  //       });
  //       this.applyFilters();
  //       this.closeModals();
  //       this.isSubmitting = false;
  //     },
  //     error: (error) => {
  //       console.error('Error adding wallpaper:', error);
  //       alert('Error adding wallpaper');
  //       this.isSubmitting = false;
  //     }
  //   });
  // }
addWallpaper() {
  console.log('=== ENHANCED VALIDATION ===');
  console.log('Form data:', this.newWallpaper);

  // Check required fields
  if (!this.newWallpaper.title || !this.newWallpaper.category) {
    alert('Please fill in title and category');
    return;
  }

  const hasImageFile = this.newWallpaper.imageFile !== null;
  const hasImageUrl = this.newWallpaper.imageUrl && this.newWallpaper.imageUrl.trim().length > 0;
  
  // Detect if imageUrl is base64 data URL
  const isBase64DataUrl = hasImageUrl && this.newWallpaper.imageUrl!.startsWith('data:');
  const isRegularUrl = hasImageUrl && this.newWallpaper.imageUrl!.startsWith('http');

  console.log('Available image sources:', { 
    hasImageFile, 
    hasImageUrl, 
    isBase64DataUrl, 
    isRegularUrl 
  });

  // Use whatever image source is available
  if (!hasImageFile && !hasImageUrl) {
    alert('Please provide either an image URL or select a file');
    return;
  }

  const categoryObj = this.categories.find(c => c.name === this.newWallpaper.category);
  if (!categoryObj) {
    alert('Invalid category');
    return;
  }

  let payload: any;
  
  // DECISION LOGIC: Handle all three cases
  if (hasImageFile) {
    // Case 1: File upload (highest priority)
    console.log('✅ Using FILE UPLOAD (file available)');
    const formData = new FormData();
    formData.append('title', this.newWallpaper.title);
    formData.append('description', this.newWallpaper.description || '');
    formData.append('categoryId', categoryObj.id.toString());
    formData.append('imageFile', this.newWallpaper.imageFile!);
    
    payload = formData;
  } 
  else if (isBase64DataUrl) {
    // Case 2: Convert base64 to file and upload
    console.log('🔄 Converting base64 to FILE UPLOAD');
    try {
      const file = this.dataURLtoFile(this.newWallpaper.imageUrl!, 'wallpaper.jpg');
      const formData = new FormData();
      formData.append('title', this.newWallpaper.title);
      formData.append('description', this.newWallpaper.description || '');
      formData.append('categoryId', categoryObj.id.toString());
      formData.append('imageFile', file);
      
      payload = formData;
      console.log('✅ Base64 converted to file:', file.name, file.type, file.size + ' bytes');
    } catch (error) {
      console.error('❌ Error converting base64 to file:', error);
      alert('Error processing image data. Please try uploading as a file instead.');
      return;
    }
  }
  else if (isRegularUrl) {
    // Case 3: Use regular HTTP URL
    console.log('🌐 Using URL UPLOAD (regular HTTP URL)');
    payload = {
      title: this.newWallpaper.title,
      imageUrl: this.newWallpaper.imageUrl,
      description: this.newWallpaper.description,
      categoryId: categoryObj.id
    };
  }
  else {
    // Case 4: Invalid URL format
    alert('Please provide a valid HTTP URL or upload a file');
    return;
  }

  // Debug: Log what we're sending
  console.log('=== FINAL PAYLOAD ===');
  if (payload instanceof FormData) {
    console.log('Payload type: FormData');
    for (let [key, value] of (payload as any).entries()) {
      if (value instanceof File) {
        console.log(`${key}: File - ${value.name}, ${value.type}, ${value.size} bytes`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }
  } else {
    console.log('Payload type: JSON', payload);
  }

  this.isSubmitting = true;

  this.apiService.addWallpaper(payload).subscribe({
    next: (response) => {
      console.log('✅ Wallpaper added successfully:', response);
      this.wallpapers.unshift({
        id: response.id,
        title: response.title,
        description: response.description,
        imageUrl: response.imageUrl,
        category: categoryObj.name
      });
      this.applyFilters();
      this.closeModals();
      this.isSubmitting = false;
    },
    error: (error) => {
      console.error('❌ Error adding wallpaper:', error);
      console.error('Error details:', error.error);
      
      // Show user-friendly error message
      if (error.status === 400) {
        alert('Invalid request: ' + (error.error?.message || 'Please check your input'));
      } else if (error.status === 413) {
        alert('File too large: Please choose a smaller image');
      } else {
        alert('Error adding wallpaper: ' + (error.error?.message || 'Please try again'));
      }
      this.isSubmitting = false;
    }
  });
}
// Add these methods to your component
switchToUrlMode() {
  this.newWallpaper.useFileUpload = false;
  console.log('Switched to URL mode');
}

switchToFileMode() {
  this.newWallpaper.useFileUpload = true;
  console.log('Switched to File mode');
  }
  private dataURLtoFile(dataurl: string, filename: string): File {
  try {
    console.log('🔧 Converting data URL to file...');
    console.log('Data URL length:', dataurl.length);
    console.log('Data URL preview:', dataurl.substring(0, 100) + '...');

    // Clean the data URL - remove any newlines or extra spaces
    const cleanDataUrl = dataurl.replace(/\s/g, '').trim();
    
    // Extract the MIME type and base64 data from the data URL
    const arr = cleanDataUrl.split(',');
    if (arr.length < 2) {
      throw new Error('Invalid data URL format - no comma found');
    }

    const header = arr[0];
    const mimeMatch = header.match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    
    console.log('Detected MIME type:', mime);
    
    // Get the base64 data and clean it
    let base64Data = arr[1];
    
    // Remove any potential data URL artifacts
    base64Data = base64Data.replace(/\s/g, '');
    
    // Validate base64 (optional but helpful)
    if (!this.isValidBase64(base64Data)) {
      console.warn('Base64 data may be corrupted, attempting to process anyway...');
    }

    // Handle base64 decoding with error recovery
    let binaryString: string;
    try {
      binaryString = atob(base64Data);
    } catch (e) {
      console.error('Base64 decoding failed, attempting alternative approach...');
      
      // Alternative approach: try to fix common base64 issues
      base64Data = base64Data
        .replace(/[^A-Za-z0-9+/]/g, '') // Remove non-base64 characters
        .padEnd(base64Data.length + (4 - (base64Data.length % 4)) % 4, '='); // Add padding if needed
        
      binaryString = atob(base64Data);
    }

    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    console.log('✅ Successfully converted to file:', {
      filename,
      mimeType: mime,
      size: bytes.length,
      originalBase64Length: base64Data.length
    });
    
    // Create and return File object
    return new File([bytes], filename, { type: mime });
  } catch (error) {
    console.error('❌ Critical error in dataURLtoFile:', error);
    console.error('Data URL that failed:', dataurl.substring(0, 200) + '...');
    throw new Error('Failed to convert base64 to file: ' + error);
  }
}

// Helper method to validate base64
private isValidBase64(str: string): boolean {
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
}
 updateWallpaper() {
  console.log('=== UPDATE VALIDATION ===');
  console.log('Form data:', this.selectedWallpaper);

  // Check required fields
  if (!this.selectedWallpaper.title || !this.selectedWallpaper.category) {
    alert('Please fill in title and category');
    return;
  }

  const hasImageFile = this.selectedWallpaper.imageFile !== null;
  const hasImageUrl = this.selectedWallpaper.imageUrl && this.selectedWallpaper.imageUrl.trim().length > 0;
  
  // Detect if imageUrl is base64 data URL
  const isBase64DataUrl = hasImageUrl && this.selectedWallpaper.imageUrl!.startsWith('data:');
  const isRegularUrl = hasImageUrl && this.selectedWallpaper.imageUrl!.startsWith('http');

  console.log('Available image sources:', { 
    hasImageFile, 
    hasImageUrl, 
    isBase64DataUrl, 
    isRegularUrl 
  });

  const categoryObj = this.categories.find(c => c.name === this.selectedWallpaper.category);
  if (!categoryObj) {
    alert('Invalid category');
    return;
  }

  let payload: any;
  let useFormData = false;
  
  // DECISION LOGIC: Same as addWallpaper
  if (hasImageFile) {
    // Case 1: File upload - use FormData
    console.log('✅ Using FILE UPLOAD for update');
    const formData = new FormData();
    formData.append('title', this.selectedWallpaper.title);
    formData.append('description', this.selectedWallpaper.description || '');
    formData.append('categoryId', categoryObj.id.toString());
    formData.append('imageFile', this.selectedWallpaper.imageFile!);
    
    payload = formData;
    useFormData = true;
  } 
  else if (isBase64DataUrl) {
    // Case 2: Convert base64 to file and upload
    console.log('🔄 Converting base64 to FILE for update');
    try {
      const file = this.dataURLtoFile(this.selectedWallpaper.imageUrl!, 'wallpaper.jpg');
      const formData = new FormData();
      formData.append('title', this.selectedWallpaper.title);
      formData.append('description', this.selectedWallpaper.description || '');
      formData.append('categoryId', categoryObj.id.toString());
      formData.append('imageFile', file);
      
      payload = formData;
      useFormData = true;
      console.log('✅ Base64 converted to file');
    } catch (error) {
      console.error('❌ Error converting base64 to file:', error);
      alert('Error processing image data');
      return;
    }
  }
  else if (isRegularUrl) {
    // Case 3: Use regular HTTP URL - send as FormData since backend expects [FromForm]
    console.log('🌐 Using URL UPLOAD for update');
    const formData = new FormData();
    formData.append('title', this.selectedWallpaper.title);
    formData.append('description', this.selectedWallpaper.description || '');
    formData.append('categoryId', categoryObj.id.toString());
    formData.append('imageUrl', this.selectedWallpaper.imageUrl!);
    
    payload = formData;
    useFormData = true;
  }
  else {
    // Case 4: No new image provided, just update other fields
    console.log('📝 Updating without image change');
    const formData = new FormData();
    formData.append('title', this.selectedWallpaper.title);
    formData.append('description', this.selectedWallpaper.description || '');
    formData.append('categoryId', categoryObj.id.toString());
    // No image fields - backend should keep existing image
    
    payload = formData;
    useFormData = true;
  }

  // Debug: Log what we're sending
  console.log('=== FINAL UPDATE PAYLOAD ===');
  console.log('Using FormData:', useFormData);
  
  if (useFormData) {
    console.log('Payload type: FormData');
    for (let [key, value] of (payload as any).entries()) {
      if (value instanceof File) {
        console.log(`${key}: File - ${value.name}, ${value.type}, ${value.size} bytes`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }
  }

  this.isSubmitting = true;

  this.apiService.updateWallpaper(this.selectedWallpaper.id, payload).subscribe({
    next: (updated) => {
      console.log('✅ Wallpaper updated successfully:', updated);
      
      // Verify what was actually updated
      console.log('Updated response:', {
        id: updated.id,
        title: updated.title,
        description: updated.description,
        imageUrl: updated.imageUrl,
        category: updated.category
      });
      
      const index = this.wallpapers.findIndex(w => w.id === updated.id);
      if (index !== -1) {
        this.wallpapers[index] = {
          ...updated,
          category: categoryObj.name
        };
        console.log('✅ Wallpaper updated in local array');
      } else {
        console.warn('❌ Wallpaper not found in local array');
      }
      
      this.applyFilters();
      this.closeModals();
      this.isSubmitting = false;
    },
    error: (error) => {
      console.error('❌ Error updating wallpaper:', error);
      console.error('Error details:', error.error);
      
      if (error.status === 400) {
        alert('Invalid request: ' + (error.error?.message || 'Please check your input'));
      } else {
        alert('Error updating wallpaper: ' + (error.error?.message || 'Please try again'));
      }
      this.isSubmitting = false;
    }
  });
}
  // Delete Wallpaper
  deleteWallpaper() {
    this.isSubmitting = true;

    this.apiService.deleteWallpaper(this.selectedWallpaper.id).subscribe({
      next: () => {
        this.wallpapers = this.wallpapers.filter(w => w.id !== this.selectedWallpaper.id);
        this.applyFilters();
        this.closeModals();
        this.isSubmitting = false;
      },
      error: () => {
        alert('Error deleting wallpaper');
        this.isSubmitting = false;
      }
    });
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