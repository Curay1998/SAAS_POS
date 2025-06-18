import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // For *ngFor, *ngIf, etc.

// Placeholder interfaces for data structures (to be refined later)
interface ProductCategory {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  imageUrl?: string; // Optional image
}

interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

@Component({
  selector: 'app-pos',
  templateUrl: './pos.html',
  styleUrls: ['./pos.css'],
  standalone: true,
  imports: [CommonModule] // Import CommonModule for directives
})
export class PosComponent implements OnInit {
  // Placeholder data - to be replaced by service calls later
  categories: ProductCategory[] = [
    { id: 1, name: 'Beverages' },
    { id: 2, name: 'Snacks' },
    { id: 3, name: 'Main Courses' }
  ];
  selectedCategoryId: number | null = null;

  products: Product[] = [
    { id: 101, name: 'Coffee', price: 2.50, categoryId: 1, imageUrl: 'https://via.placeholder.com/100?text=Coffee' },
    { id: 102, name: 'Tea', price: 2.00, categoryId: 1, imageUrl: 'https://via.placeholder.com/100?text=Tea' },
    { id: 201, name: 'Chips', price: 1.50, categoryId: 2, imageUrl: 'https://via.placeholder.com/100?text=Chips' },
    { id: 202, name: 'Cookies', price: 2.20, categoryId: 2, imageUrl: 'https://via.placeholder.com/100?text=Cookies' },
    { id: 301, name: 'Sandwich', price: 5.50, categoryId: 3, imageUrl: 'https://via.placeholder.com/100?text=Sandwich' },
    { id: 302, name: 'Salad', price: 6.00, categoryId: 3, imageUrl: 'https://via.placeholder.com/100?text=Salad' }
  ];
  filteredProducts: Product[] = [];

  cart: CartItem[] = [];
  cartTotal: number = 0;

  constructor() { }

  ngOnInit(): void {
    // Initially, show all products or products from the first category
    if (this.categories.length > 0) {
      // this.selectCategory(this.categories[0].id);
      this.filteredProducts = [...this.products]; // Show all products by default
    }
  }

  selectCategory(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    if (categoryId === null) {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(p => p.categoryId === categoryId);
    }
  }

  addToCart(product: Product): void {
    const existingItem = this.cart.find(item => item.productId === product.id);
    if (existingItem) {
      existingItem.quantity++;
      existingItem.total = existingItem.quantity * existingItem.price;
    } else {
      this.cart.push({
        productId: product.id,
        productName: product.name,
        quantity: 1,
        price: product.price,
        total: product.price
      });
    }
    this.calculateCartTotal();
  }

  removeFromCart(productId: number): void {
    const itemIndex = this.cart.findIndex(item => item.productId === productId);
    if (itemIndex > -1) {
      this.cart.splice(itemIndex, 1);
      this.calculateCartTotal();
    }
  }

  updateQuantity(productId: number, newQuantity: number): void {
    const item = this.cart.find(item => item.productId === productId);
    if (item) {
      if (newQuantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = newQuantity;
        item.total = item.quantity * item.price;
        this.calculateCartTotal();
      }
    }
  }

  calculateCartTotal(): void {
    this.cartTotal = this.cart.reduce((sum, item) => sum + item.total, 0);
  }

  checkout(): void {
    // Placeholder for checkout logic
    if (this.cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    alert(`Checkout initiated! Total: $${this.cartTotal.toFixed(2)}
Thank you for your order! (This is a placeholder)`);
    // Here you would typically send the order to a backend service
    this.cart = []; // Clear cart after checkout
    this.calculateCartTotal();
  }
}
