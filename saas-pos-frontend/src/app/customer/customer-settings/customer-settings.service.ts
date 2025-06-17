import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerSetting } from './customer-setting.model';

@Injectable({
  providedIn: 'root' // Or providedIn: CustomerSettingsModule if preferred and module created
})
export class CustomerSettingsService {
  private apiUrl = '/api/customer/settings'; // Adjust as needed if proxy is different

  constructor(private http: HttpClient) { }

  getSettings(): Observable<CustomerSetting> {
    return this.http.get<CustomerSetting>(this.apiUrl);
  }

  updateSettings(settings: Partial<CustomerSetting>): Observable<CustomerSetting> {
    return this.http.put<CustomerSetting>(this.apiUrl, settings);
  }
}
