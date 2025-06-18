import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id?: number;
  name: string;
  email: string;
  role?: string;
  // Add other user properties as needed
}

export interface AuthResponse {
  access_token?: string;
  token_type?: string;
  user?: User;
  message?: string;
  data?: User; // For registration response
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private currentTokenSubject = new BehaviorSubject<string | null>(null);
  public currentToken$ = this.currentTokenSubject.asObservable();

  constructor(private http: HttpClient) {
    // Initialize state from localStorage (or other storage) if available
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');
    if (token && user) {
      this.currentTokenSubject.next(token);
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  get currentTokenValue(): string | null {
    return this.currentTokenSubject.value;
  }

  register(user: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, user).pipe(
      tap(response => {
        // Assuming registration might also log the user in or return user data
        if (response && response.access_token && response.user) {
          this.setSession(response);
        } else if (response && response.data) { // Handle if only user data is returned
          // Potentially set user data without token if registration doesn't auto-login
        }
      })
    );
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.access_token && response.user) {
          this.setSession(response);
        }
      })
    );
  }

  private setSession(authResponse: AuthResponse): void {
    if (authResponse.access_token && authResponse.user) {
      localStorage.setItem('authToken', authResponse.access_token);
      localStorage.setItem('currentUser', JSON.stringify(authResponse.user));
      this.currentTokenSubject.next(authResponse.access_token);
      this.currentUserSubject.next(authResponse.user);
    }
  }

  logout(): void {
    // For a real backend, you would call a logout endpoint:
    // this.http.post(`${this.apiUrl}/logout`, {}).subscribe(() => this.clearSession());
    // For now, just clear local session
    this.clearSession();
  }

  private clearSession(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.currentTokenSubject.next(null);
    this.currentUserSubject.next(null);
    // Potentially navigate to login page: this.router.navigate(['/login']);
  }
}
