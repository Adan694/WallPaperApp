// api.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
    constructor(private http: HttpClient) {}

  baseUrl = 'http://localhost:5000/api';

  async getCategories() {
    const res = await fetch(`${this.baseUrl}/categories`);
    return await res.json();
  }

  async getWallpapers() {
    const res = await fetch(`${this.baseUrl}/wallpapers`);
    return await res.json();
  }

 async getWallpapersByCategory(category: string) {
  const res = await fetch(`${this.baseUrl}/wallpapers/category/${category}`);
  return await res.json();
}

  getWallpaperById(id: number): Promise<any> {
  return fetch(`${this.baseUrl}/wallpapers/${id}`).then(res => res.json());
}
async searchWallpapers(keyword: string) {
  const res = await fetch(`${this.baseUrl}/wallpapers/search?q=${encodeURIComponent(keyword)}`);
  return await res.json();
}

  async test() {
    const res = await fetch(`${this.baseUrl}/test`);
    return await res.json();
  }

   addWallpaper(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/wallpapers`, data);
  }

  // PUT
  updateWallpaper(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/wallpapers/${id}`, data);
  }

  // DELETE
  deleteWallpaper(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/wallpapers/${id}`);
  }
  // --- CATEGORIES ---

addCategory(data: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/categories`, data);
}

updateCategory(id: number, data: any): Observable<any> {
  return this.http.put(`${this.baseUrl}/categories/${id}`, data);
}

deleteCategory(id: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/categories/${id}`);
}

}
