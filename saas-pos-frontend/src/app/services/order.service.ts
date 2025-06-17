import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CartItem } from '../models/cart.model';
import { OrderResponse, OrderResponseItem } from '../models/order.model';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private static currentOrderId = 1000;

  constructor(private cartService: CartService) { }

  placeOrder(cartItems: CartItem[], totalAmount: number): Observable<OrderResponse> {
    console.log('Placing order (mock):', { items: cartItems, totalAmount });

    const orderResponseItems: OrderResponseItem[] = cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        priceAtPurchase: item.price,
        name: item.name
    }));

    const mockOrder: OrderResponse = {
      orderId: ++OrderService.currentOrderId,
      status: 'confirmed',
      items: orderResponseItems,
      totalAmount: totalAmount,
      orderDate: new Date().toISOString()
    };

    return of(mockOrder).pipe(
      tap(() => {
        this.cartService.clearCart();
      })
    );
  }
}
