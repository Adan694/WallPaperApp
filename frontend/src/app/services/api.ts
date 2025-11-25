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
interface AnalyticsResponse {
  totalDownloads: number;
  totalLikes: number;
  popularCategory: string;
  recentUploads: any[];
  storageUsed: string;
}

interface ActivityLog {
  action: string;
  details: string;
  time: string;
  type: string;
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

  getAnalytics(): Observable<AnalyticsResponse> {
  return this.http.get<AnalyticsResponse>(`${this.baseUrl}/admin/analytics`);
}

getAdminActivities(): Observable<ActivityLog[]> {
  return this.http.get<ActivityLog[]>(`${this.baseUrl}/admin/activities`);
}
incrementDownload(id: number) {
    return this.http.post(`/api/wallpapers/${id}/download`, {});
  }


incrementLike(wallpaperId: number) {
  return this.http.post(`/api/wallpapers/${wallpaperId}/like`, {});
}
downloadWallpaper(wallpaper: any) {
  const url = `http://localhost:5000/api/wallpapers/download/${wallpaper.id}`;
  const link = document.createElement('a');
  link.href = url;
  link.download = wallpaper.title || 'wallpaper';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
// Correct like method
likeWallpaper(id: number, userEmail: string) {
  return this.http.post(`${this.baseUrl}/wallpapers/${id}/like`, { userEmail });
}

unlikeWallpaper(id: number, userEmail: string) {
  return this.http.post(`${this.baseUrl}/wallpapers/${id}/unlike`, { userEmail });
}




}

