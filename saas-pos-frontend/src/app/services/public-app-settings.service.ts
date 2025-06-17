import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment'; // Adjust path as necessary

// Re-using AppSettings from AdminSettingsService for consistency, or define separately if preferred
// Ensure AppSettings allows for potentially null values if some settings might not be set
export interface AppSettings {
    [key: string]: string | null;
}

@Injectable({
    providedIn: 'root' // Singleton service
})
export class PublicAppSettingsService {
    private apiUrl = `${environment.apiBaseUrl}/public-settings`;
    private settingsSubject = new BehaviorSubject<AppSettings | null>(null);
    public settings$: Observable<AppSettings | null> = this.settingsSubject.asObservable();

    constructor(private http: HttpClient) {
        this.loadPublicSettings().subscribe(); // Load settings when service is instantiated
    }

    private loadPublicSettings(): Observable<AppSettings | null> {
        return this.http.get<AppSettings>(this.apiUrl, { withCredentials: false }) // No credentials needed for public route
            .pipe(
                tap(settings => {
                    this.settingsSubject.next(settings);
                }),
                catchError(error => {
                    console.error('Failed to load public app settings:', error);
                    this.settingsSubject.next(null); // Emit null or a default state on error
                    return of(null); // Handle error gracefully
                })
            );
    }

    // Optional: A method to force a reload if ever needed
    public refreshSettings(): Observable<AppSettings | null> {
        return this.loadPublicSettings();
    }

    // Optional: A convenience getter for the current value if needed synchronously (use with caution)
    public getCurrentSettings(): AppSettings | null {
        return this.settingsSubject.getValue();
    }
}
