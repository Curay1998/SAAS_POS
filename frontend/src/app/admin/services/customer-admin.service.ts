import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminCustomerView {
  id?: number;
  name: string;
  email: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root' // Or provided in AdminModule
})
export class CustomerAdminService {
  private apiUrl = `${environment.apiUrl}/admin/customers`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getCustomers(): Observable<AdminCustomerView[]> {
    return this.http.get<AdminCustomerView[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getCustomer(id: number): Observable<AdminCustomerView> {
    return this.http.get<AdminCustomerView>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createCustomer(customerData: any): Observable<AdminCustomerView> {
    return this.http.post<AdminCustomerView>(this.apiUrl, customerData, { headers: this.getAuthHeaders() });
  }

  updateCustomer(id: number, customerData: any): Observable<AdminCustomerView> {
    return this.http.put<AdminCustomerView>(`${this.apiUrl}/${id}`, customerData, { headers: this.getAuthHeaders() });
  }

  deleteCustomer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
