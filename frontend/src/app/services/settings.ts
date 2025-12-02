import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SettingsService {
private api = 'http://localhost:5000/api/settings';

  constructor(private http: HttpClient) {}

  getSettings() {
    return this.http.get(this.api);
  }

  updateSettings(data: FormData) {
  return this.http.put(this.api, data);
}

}
