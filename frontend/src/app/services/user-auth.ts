import { Injectable } from '@angular/core';
import { ApiService } from './api';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserAuth {

  constructor(private api: ApiService) {
    this.fixCorruptedData(); 
  }

  login(email: string, password: string) {
    return this.api.userLogin({ email, password }).pipe(
      tap((res: any) => {
        // Handle different response structures
        const userData = res.user || res || {};
        
        // Ensure email is always present
        if (!userData.email) {
          userData.email = email;
        }
        
        // Ensure token is preserved
        if (res.token && !userData.token) {
          userData.token = res.token;
        }
        
        console.log('Storing user data:', userData);
        localStorage.setItem('userSession', JSON.stringify(userData));
        this.fixCorruptedData(); 
      })
    );
  }

  register(data: any) {
    return this.api.userRegister(data);
  }

  getUser(): { email: string; token?: string } | null {
    const userStr = localStorage.getItem('userSession');
    if (!userStr) return null;
    
    try {
      const user = JSON.parse(userStr);
      
      // Validate user object has required properties
      if (user && typeof user === 'object' && user.email) {
        return user;
      }
      
      console.warn('Invalid user data structure:', user);
      return null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  logout() {
    localStorage.removeItem('userSession');
  }

  isLoggedIn(): boolean {
    return !!this.getUser(); 
  }

  private fixCorruptedData() {
    const corruptedKeys = Object.keys(localStorage).filter(key => 
      key.startsWith('favorites_') && (key.endsWith('undefined') || key === 'favorites_')
    );
    
    corruptedKeys.forEach(key => {
      console.log('Removing corrupted favorites key:', key);
      localStorage.removeItem(key);
    });
  }
}