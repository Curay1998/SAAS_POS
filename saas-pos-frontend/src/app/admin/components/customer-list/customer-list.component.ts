import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Added
import { RouterModule } from '@angular/router'; // Added
import { CustomerAdminService, AdminCustomerView } from '../../../services/customer-admin.service'; // Added

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
  standalone: true, // Added
  imports: [CommonModule, RouterModule] // Added
})
export class CustomerListComponent implements OnInit {

  public customers: AdminCustomerView[] = [];
  public isLoading: boolean = true; // Added for loading state
  public errorMessage: string | null = null; // Added for error handling

  constructor(private customerAdminService: CustomerAdminService) { } // Injected service

  ngOnInit(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.customerAdminService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch customers:', err);
        this.errorMessage = 'Failed to load customers. Please try again later.';
        this.isLoading = false;
      }
    });
  }
}
