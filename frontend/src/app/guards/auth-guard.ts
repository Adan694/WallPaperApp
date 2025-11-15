import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
  const router = inject(Router);
  
  // Check if user is logged in (simple version)
  const user = localStorage.getItem('currentUser');
  
  if (user) {
    return true; // Allow access
  }
  
  // Redirect to login if not authenticated
  router.navigate(['/admin/login']);
  return false;
};