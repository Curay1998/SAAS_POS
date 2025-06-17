import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule

import { CustomerAdminRoutingModule } from './customer-admin-routing';
// DashboardComponent is standalone, so it imports its own dependencies.
// If CustomerAdminService was providedIn: 'admin', you'd add it here.

@NgModule({
  declarations: [
    // DashboardComponent is standalone, no need to declare here
  ],
  imports: [
    CommonModule,
    CustomerAdminRoutingModule,
    ReactiveFormsModule // Add for any non-standalone components in this module that might need it
  ],
  // providers: [CustomerAdminService] // If service is scoped to this module
})
export class AdminModule { }
