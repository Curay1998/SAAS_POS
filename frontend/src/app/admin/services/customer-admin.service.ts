import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService, User } from '../../auth/auth.service'; // Re-use User interface

// Potentially extend User interface if admin view needs more/different fields
export interface AdminCustomerView extends User {
    created_at?: string;
    // other admin specific fields
}

@Injectable({
  providedIn: 'root' // Or provided in AdminModule
})
export class CustomerAdminService {
  private apiUrl = `${environment.apiUrl}/admin/customers`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.currentTokenValue;
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getCustomers(): Observable<AdminCustomerView[]> {
    return this.http.get<AdminCustomerView[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getCustomer(id: number): Observable<AdminCustomerView> {
    return this.http.get<AdminCustomerView>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createCustomer(customerData: Partial<AdminCustomerView>): Observable<AdminCustomerView> {
    // Ensure password (if included) is handled appropriately by backend stub
    return this.http.post<AdminCustomerView>(this.apiUrl, customerData, { headers: this.getAuthHeaders() });
  }

  updateCustomer(id: number, customerData: Partial<AdminCustomerView>): Observable<AdminCustomerView> {
    return this.http.put<AdminCustomerView>(`${this.apiUrl}/${id}`, customerData, { headers: this.getAuthHeaders() });
  }

  deleteCustomer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
