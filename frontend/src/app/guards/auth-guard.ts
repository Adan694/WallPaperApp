import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
  const router = inject(Router);

  const user = localStorage.getItem('currentUser');

  if (user) return true;

  router.navigate(['/admin/login']);
  return false;
};
