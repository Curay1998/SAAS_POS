import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // CommonModule for *ngFor, *ngIf, etc.
import { ReactiveFormsModule } from '@angular/forms'; // For product form
import { HttpClientModule } from '@angular/common/http'; // For ProductService, though often imported in AppModule

import { ProductRoutingModule } from './product-routing-module';
import { ProductListComponent } from './components/product-list/product-list';
import { ProductFormComponent } from './components/product-form/product-form';
// ProductService is typically providedIn: 'root' or in a higher-level module if shared.
// If you want to scope it only to this module (and its children), you'd provide it here.
// import { ProductService } from './services/product';


// Example Angular Material Modules (uncomment and install if used)
// import { MatTableModule } from '@angular/material/table';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatSortModule } from '@angular/material/sort';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatCardModule } from '@angular/material/card';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductFormComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    ReactiveFormsModule,
    HttpClientModule, // Ensure HttpClientModule is available for ProductService

    // Example Angular Material Modules (add to imports array if used)
    // MatTableModule,
    // MatPaginatorModule,
    // MatSortModule,
    // MatButtonModule,
    // MatIconModule,
    // MatFormFieldModule,
    // MatInputModule,
    // MatCardModule,
    // MatProgressSpinnerModule,
  ],
  // providers: [ProductService] // Only if you want to scope the service to this module
})
export class ProductModule { }
