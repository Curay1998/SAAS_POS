import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomerAdminService, AdminCustomerView } from '../../services/customer-admin.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class CustomerListComponent implements OnInit {
  public customers: AdminCustomerView[] = [];
  public isLoading: boolean = true;
  public errorMessage: string | null = null;

  constructor(private customerAdminService: CustomerAdminService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.customerAdminService.getCustomers().subscribe({
      next: (data: any) => {
        this.customers = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Failed to fetch customers:', err);
        this.errorMessage = 'Failed to load customers. Please try again later.';
        this.isLoading = false;
      }
    });
  }
}