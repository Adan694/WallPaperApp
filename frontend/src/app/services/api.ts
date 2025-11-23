// api.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) { }

  baseUrl = 'http://localhost:5000/api';

  // WALLPAPERS
  getWallpapers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/wallpapers`);
  }

  getWallpaperById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/wallpapers/${id}`);
  }

  getWallpapersByCategory(category: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/wallpapers/category/${category}`);
  }

  searchWallpapers(keyword: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/wallpapers/search?q=${keyword}`);
  }

  // In your api.service.ts - update addWallpaper and updateWallpaper methods

  // In your api.service.ts - FIXED VERSION
  addWallpaper(data: any): Observable<any> {
    let headers = new HttpHeaders();

    // If it's FormData, don't set Content-Type (let browser set it with boundary)
    // If it's regular object, set Content-Type to application/json
    if (!(data instanceof FormData)) {
      headers = headers.set('Content-Type', 'application/json');
    }

    return this.http.post(`${this.baseUrl}/wallpapers`, data, { headers });
  }

  updateWallpaper(id: number, data: any): Observable<any> {
    let headers = new HttpHeaders();

    // If it's regular object, set Content-Type to application/json
    if (!(data instanceof FormData)) {
      headers = headers.set('Content-Type', 'application/json');
    }

    return this.http.put(`${this.baseUrl}/wallpapers/${id}`, data, { headers });
  }
  deleteWallpaper(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/wallpapers/${id}`);
  }

  // CATEGORIES
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/categories`);
  }

  addCategory(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/categories`, data);
  }

  updateCategory(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/categories/${id}`, data);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/categories/${id}`);
  }

  // AUTH
  userRegister(user: any) {
    return this.http.post(`${this.baseUrl}/auth/register`, user);
  }

  userLogin(credentials: any) {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials);
  }

  // ADMIN
  getAdminUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/admin/users`);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/users/${userId}`);
  }

  changeUserRole(userId: number, role: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/admin/users/${userId}/role`, { newRole: role });
  }

  getAnalytics() {
    return this.http.get(`${this.baseUrl}/admin/analytics`);
  }

  getAdminActivities() {
    return this.http.get(`${this.baseUrl}/admin/activities`);
  }

}

