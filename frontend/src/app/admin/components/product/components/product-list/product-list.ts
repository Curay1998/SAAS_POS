import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product, ProductService, PaginatedProducts } from '../../services/product'; // Adjusted path

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.html', // .html extension
  styleUrls: ['./product-list.css'] // .css extension
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  paginatedResponse: PaginatedProducts | null = null; // To store pagination data
  // Example for displayedColumns if using Angular Material table, adapt as needed
  displayedColumns: string[] = ['id', 'name', 'sku', 'quantity', 'price', 'actions'];

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(page: number = 1): void {
    // If your service's getProducts method supports pagination parameters, pass them here
    // For example: this.productService.getProducts({ page: page }).subscribe(...)
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.paginatedResponse = response;
        this.products = response.data; // Assuming 'data' holds the array of products
      },
      error: (err) => console.error('Error loading products:', err)
    });
  }

  addProduct(): void {
    this.router.navigate(['/admin/products/new']);
  }

  editProduct(productId: number): void {
    this.router.navigate(['/admin/products/edit', productId]);
  }

  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          console.log('Product deleted successfully');
          // Reload current page of products
          this.loadProducts(this.paginatedResponse?.current_page || 1);
        },
        error: (err) => console.error('Error deleting product:', err)
      });
    }
  }

  // Optional: Methods for pagination if not using a library
  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= (this.paginatedResponse?.last_page || 1)) {
      this.loadProducts(pageNumber);
    }
  }

  nextPage(): void {
    if (this.paginatedResponse?.next_page_url) {
      this.loadProducts((this.paginatedResponse.current_page || 0) + 1);
    }
  }

  prevPage(): void {
    if (this.paginatedResponse?.prev_page_url) {
      this.loadProducts((this.paginatedResponse.current_page || 0) - 1);
    }
  }
}
