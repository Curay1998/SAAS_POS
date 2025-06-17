import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private mockProducts: Product[] = [
    { id: 1, name: 'Laptop Pro X', price: 1299.99, sku: 'LP-PROX-001', description: '15-inch, 32GB RAM, 1TB SSD' },
    { id: 2, name: 'Wireless Mouse Ergonomic', price: 49.99, sku: 'WM-ERGO-002', description: 'Ergonomic wireless mouse with 5 buttons' },
    { id: 3, name: 'Mechanical Keyboard RGB', price: 99.99, sku: 'MK-RGB-003', description: 'Full-size RGB backlit mechanical keyboard' },
    { id: 4, name: 'USB-C Hub 7-in-1', price: 59.99, sku: 'UCHUB-7IN1-004', description: '7-in-1 USB-C Hub with HDMI, SD Card Reader' },
    { id: 5, name: '4K Monitor 27-inch', price: 349.99, sku: 'MON-4K-27-005', description: '27-inch 4K UHD Monitor' }
  ];

  constructor() { }

  getProducts(): Observable<Product[]> {
    return of(this.mockProducts);
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.getProducts().pipe(
      map(products => products.find(product => product.id === id))
    );
  }
}
