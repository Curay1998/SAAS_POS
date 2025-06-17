import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Import Router and RouterModule
import { Observable } from 'rxjs';
import { CartItem } from '../../models/cart.model';
import { OrderResponse } from '../../models/order.model';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout-form',
  standalone: true,
  imports: [CommonModule, RouterModule], // Add RouterModule
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.css']
})
export class CheckoutFormComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;
  cartTotal$: Observable<number>;
  customerName: string = ''; // Simple example form field

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.cartItems$ = this.cartService.getCartItems();
    this.cartTotal$ = this.cartService.getCartTotal();
  }

  ngOnInit(): void {}

  async submitOrder(): Promise<void> {
    // This is a simplified version. In a real app, you'd collect more form data.
    const items = await this.cartService.getCartItems().toPromise(); // Not ideal to use toPromise, but for simplicity here
    const total = await this.cartService.getCartTotal().toPromise();

    if (items && items.length > 0 && total !== undefined) {
      this.orderService.placeOrder(items, total).subscribe({
        next: (orderResponse: OrderResponse) => {
          console.log('Order placed (mock):', orderResponse);
          this.router.navigate(['/order-confirmation', orderResponse.orderId]);
        },
        error: (err) => {
          console.error('Failed to place order (mock):', err);
          // Handle error appropriately
        }
      });
    } else {
      console.warn('Cannot place order with empty cart or undefined total.');
      this.router.navigate(['/products']); // Redirect to products if cart is empty
    }
  }
}
