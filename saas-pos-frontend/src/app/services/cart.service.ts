import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$: Observable<CartItem[]> = this.itemsSubject.asObservable();

  constructor() { }

  addItem(product: Product, quantity: number = 1): void {
    const currentItems = this.itemsSubject.getValue();
    const existingItemIndex = currentItems.findIndex(item => item.id === product.id);

    if (quantity <= 0) { // If trying to add 0 or negative, treat as removal if item exists
        if (existingItemIndex > -1) {
            this.removeItem(product.id);
        }
        return;
    }

    if (existingItemIndex > -1) {
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity
      };
      this.itemsSubject.next(updatedItems);
    } else {
      this.itemsSubject.next([...currentItems, { ...product, quantity }]);
    }
  }

  updateItemQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
        this.removeItem(productId);
        return;
    }
    const currentItems = this.itemsSubject.getValue();
    const itemIndex = currentItems.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        const updatedItems = [...currentItems];
        updatedItems[itemIndex] = { ...updatedItems[itemIndex], quantity: quantity };
        this.itemsSubject.next(updatedItems);
    }
  }

  removeItem(productId: number): void {
    const currentItems = this.itemsSubject.getValue();
    this.itemsSubject.next(currentItems.filter(item => item.id !== productId));
  }

  getCartItems(): Observable<CartItem[]> {
    return this.items$;
  }

  getCartTotal(): Observable<number> {
    return this.items$.pipe(
      map(items => items.reduce((total, item) => total + (item.price * item.quantity), 0))
    );
  }

  clearCart(): void {
    this.itemsSubject.next([]);
  }
}
