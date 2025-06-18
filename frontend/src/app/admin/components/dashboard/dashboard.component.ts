import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerAdminService, AdminCustomerView } from '../../services/customer-admin.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class DashboardComponent implements OnInit {
  customers: AdminCustomerView[] = [];
  customerForm: FormGroup;
  editingCustomer: AdminCustomerView | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor(
    private customerAdminService: CustomerAdminService,
    private fb: FormBuilder
  ) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['']
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.customerAdminService.getCustomers().subscribe({
      next: (data: any) => {
        this.customers = data;
        this.isLoading = false;
      },
      error: (err: any) => {
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
      password: ''
    });
  }

  onCancelEdit(): void {
    this.editingCustomer = null;
    this.customerForm.reset();
  }

  onSubmit(): void {
    if (!this.customerForm.valid) {
      this.errorMessage = "Form is invalid.";
      return;
    }
    this.isLoading = true;
    this.errorMessage = null;

    const customerData = this.customerForm.value;

    if (this.editingCustomer) {
      this.customerAdminService.updateCustomer(this.editingCustomer.id!, customerData).subscribe({
        next: (updatedCustomer: any) => {
          this.loadCustomers();
          this.onCancelEdit();
          this.isLoading = false;
        },
        error: (err: any) => {
          this.errorMessage = 'Failed to update customer.';
          console.error(err);
          this.isLoading = false;
        }
      });
    } else {
      this.customerAdminService.createCustomer(customerData).subscribe({
        next: (newCustomer: any) => {
          this.loadCustomers();
          this.onCancelEdit();
          this.isLoading = false;
        },
        error: (err: any) => {
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
          this.loadCustomers();
          this.isLoading = false;
        },
        error: (err: any) => {
          this.errorMessage = 'Failed to delete customer.';
          console.error(err);
          this.isLoading = false;
        }
      });
    }
  }
}