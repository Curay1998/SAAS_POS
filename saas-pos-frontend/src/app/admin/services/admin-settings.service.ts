import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment'; // Adjust path as necessary

export interface Setting {
    key: string;
    value: string | null;
}

// Type for the object returned by getSettings (key-value pairs)
export interface AppSettings {
    [key: string]: string | null;
}

// Type for the payload sent to updateSettings
export interface UpdateSettingsPayload {
    settings: Setting[];
}

@Injectable({
    providedIn: 'root'
})
export class AdminSettingsService {
    private apiUrl = `${environment.apiBaseUrl}/admin/settings`; // Assumes apiBaseUrl is defined in environment.ts

    constructor(private http: HttpClient) { }

    getSettings(): Observable<AppSettings> {
        // Assuming the backend returns settings as an object: { key1: value1, key2: value2 }
        return this.http.get<AppSettings>(this.apiUrl, this.getHttpOptions());
    }

    updateSettings(settingsPayload: UpdateSettingsPayload): Observable<AppSettings> {
        return this.http.post<AppSettings>(this.apiUrl, settingsPayload, this.getHttpOptions());
    }

    private getHttpOptions() {
        // In a real app, you'd get the token from an auth service
        // For now, if your Sanctum setup relies on cookies, this might be enough.
        // If it needs a token header (e.g., 'Authorization': 'Bearer your_token'),
        // that logic would be added here.
        // For Sanctum cookie-based auth, ensure 'withCredentials: true' might be needed
        // if frontend and backend are on different domains during development.
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }),
            withCredentials: true // Important for Sanctum if using cookies & different ports/domains
        };
    }
}
