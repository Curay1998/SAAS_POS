import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; // Needed for *ngFor, async pipe, etc. in standalone components
import { Observable, Subscription } from 'rxjs';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule], // Import CommonModule here
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products$: Observable<Product[]>;
  private productSubscription: Subscription | undefined;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {
    this.products$ = this.productService.getProducts();
  }

  ngOnInit(): void {
    // Example if we needed to do something with the products array directly, not just async pipe
    // this.productSubscription = this.products$.subscribe(products => {
    //   console.log('Products loaded:', products);
    // });
  }

  addToCart(product: Product): void {
    this.cartService.addItem(product, 1);
    // Optionally, add some user feedback like a toast message or console log
    console.log(`Added ${product.name} to cart.`);
  }

  ngOnDestroy(): void {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }
}
