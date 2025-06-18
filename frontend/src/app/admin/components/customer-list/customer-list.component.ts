import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomerAdminService, AdminCustomerView } from '../../services/customer-admin.service';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule // Add MatButtonModule here
  ]
})
export class CustomerListComponent implements OnInit {
  public customers: AdminCustomerView[] = [];
  public isLoading: boolean = true;
  public errorMessage: string | null = null;
  public displayedColumns: string[] = ['id', 'name', 'email', 'created_at'];

  constructor(private customerAdminService: CustomerAdminService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.customerAdminService.getCustomers().subscribe({
      next: (data: AdminCustomerView[]) => { // Typed data
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