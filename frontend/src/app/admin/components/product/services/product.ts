import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id?: number; // Optional for creation
  name: string;
  description?: string | null;
  sku?: string | null;
  quantity: number;
  price: number;
  created_at?: string;
  updated_at?: string;
}

// Interface for paginated response (adjust as needed based on backend)
export interface PaginatedProducts {
  current_page: number;
  data: Product[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{ url: string | null; label: string; active: boolean }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

@Injectable({
  providedIn: 'root' // Provide at root level, or in ProductModule
})
export class ProductService {
  private apiUrl = 'http://localhost:8000/api/products'; // Adjust if your backend URL is different

  constructor(private http: HttpClient) { }

  // Standard HTTP options
  private getHttpOptions() {
    // Add authorization token if your API requires it
    // const token = localStorage.getItem('authToken'); // Example: get token from local storage
    // let headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    // });
    // if (token) {
    //   headers = headers.append('Authorization', `Bearer ${token}`);
    // }
    // return { headers };
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  }

  getProducts(): Observable<PaginatedProducts> {
    return this.http.get<PaginatedProducts>(this.apiUrl, this.getHttpOptions());
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

  addProduct(product: Product): Observable<Product> {
    // Ensure only fillable fields are sent, or backend handles it
    const { id, created_at, updated_at, ...payload } = product;
    return this.http.post<Product>(this.apiUrl, payload, this.getHttpOptions());
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    // Ensure only fillable fields are sent
    const { id: productId, created_at, updated_at, ...payload } = product;
    return this.http.put<Product>(`${this.apiUrl}/${id}`, payload, this.getHttpOptions());
  }

  deleteProduct(id: number): Observable<any> { // Response might be empty or a success message
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }
}
