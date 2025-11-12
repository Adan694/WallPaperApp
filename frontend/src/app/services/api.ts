// api.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
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
    const res = await fetch(`${this.baseUrl}/wallpapers/${category}`);
    return await res.json();
  }
  
  getWallpaperById(id: number): Promise<any> {
  return fetch(`${this.baseUrl}/wallpaper/${id}`).then(res => res.json());
}
async searchWallpapers(keyword: string) {
  const res = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(keyword)}`);
  return await res.json();
}

  async test() {
    const res = await fetch(`${this.baseUrl}/test`);
    return await res.json();
  }
}
