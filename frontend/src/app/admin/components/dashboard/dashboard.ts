import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerAdminService, AdminCustomerView } from '../../services/customer-admin.service';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router'; // Import RouterModule

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule, // Add RouterModule here
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ]
})
export class DashboardComponent implements OnInit {
  customers: AdminCustomerView[] = [];
  customerForm: FormGroup;
  editingCustomer: AdminCustomerView | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = false;
  displayedColumns: string[] = ['id', 'name', 'email', 'created_at', 'actions'];

  constructor(
    private customerAdminService: CustomerAdminService,
    private fb: FormBuilder
  ) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''] // Optional: only for new or password change
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.customerAdminService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load customers. Ensure you are logged in as admin.';
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  onEdit(customer: AdminCustomerView): void {
    this.editingCustomer = customer;
    this.customerForm.patchValue({
      name: customer.name,
      email: customer.email,
      password: '' // Clear password field
    });
  }

  onCancelEdit(): void {
    this.editingCustomer = null;
    this.customerForm.reset();
    this.customerForm.get('password')?.clearValidators(); // Clear password validators
    this.customerForm.get('password')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (!this.customerForm.valid) {
      this.errorMessage = "Form is invalid.";
      return;
    }
    this.isLoading = true;
    this.errorMessage = null;

    const customerData = this.customerForm.value;
    // Add password validation for new customer, optional for existing
    if (!this.editingCustomer) { // New customer
        if (!customerData.password || customerData.password.length < 8) {
            this.errorMessage = "Password must be at least 8 characters for new users.";
            this.isLoading = false;
            return;
        }
    } else { // Existing customer, only include password if provided
        if (!customerData.password) {
            delete customerData.password;
        } else if (customerData.password.length < 8) {
            this.errorMessage = "Password must be at least 8 characters if changing.";
            this.isLoading = false;
            return;
        }
    }


    if (this.editingCustomer) {
      // Update existing customer
      this.customerAdminService.updateCustomer(this.editingCustomer.id!, customerData).subscribe({
        next: (updatedCustomer) => {
          this.loadCustomers(); // Reload list
          this.onCancelEdit();   // Reset form
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to update customer.';
          console.error(err);
          this.isLoading = false;
        }
      });
    } else {
      // Create new customer
      this.customerAdminService.createCustomer(customerData).subscribe({
        next: (newCustomer) => {
          this.loadCustomers(); // Reload list
          this.onCancelEdit();   // Reset form
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to create customer.';
          console.error(err);
          this.isLoading = false;
        }
      });
    }
  }

  onDelete(customerId: number | undefined): void {
    if (!customerId) return;
    if (confirm('Are you sure you want to delete this customer?')) {
      this.isLoading = true;
      this.errorMessage = null;
      this.customerAdminService.deleteCustomer(customerId).subscribe({
        next: () => {
          this.loadCustomers(); // Reload list
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete customer.';
          console.error(err);
          this.isLoading = false;
        }
      });
    }
  }
}
