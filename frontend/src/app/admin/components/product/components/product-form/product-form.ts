import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductService } from '../../services/product'; // Adjusted path

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.html', // .html extension
  styleUrls: ['./product-form.css']   // .css extension
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      sku: ['', /*Validators.required,*/ Validators.pattern(/^[a-zA-Z0-9-]+$/)], // Example: Alphanumeric and dashes
      quantity: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.productId = +id; // Convert string to number
        this.loadProductData(this.productId);
      }
    });
  }

  loadProductData(id: number): void {
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        // PatchValue can handle partial objects and won't throw errors for missing form controls
        this.productForm.patchValue(product);
      },
      error: (err) => {
        console.error('Error loading product data:', err);
        // Optionally, navigate back or show an error message
        this.router.navigate(['/admin/products']);
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched(); // Mark fields as touched to show errors
      return;
    }

    const productData = this.productForm.value as Product;

    if (this.isEditMode && this.productId !== null) {
      this.productService.updateProduct(this.productId, productData).subscribe({
        next: () => {
          console.log('Product updated successfully');
          this.router.navigate(['/admin/products']);
        },
        error: (err) => console.error('Error updating product:', err)
      });
    } else {
      this.productService.addProduct(productData).subscribe({
        next: () => {
          console.log('Product added successfully');
          this.router.navigate(['/admin/products']);
        },
        error: (err) => console.error('Error adding product:', err)
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/products']);
  }

  // Helper for form control access in template
  get f() { return this.productForm.controls; }
}
