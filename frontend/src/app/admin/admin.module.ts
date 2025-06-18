import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing-module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
// Import CustomerListComponent if it's used in routing directly or declared here
// import { CustomerListComponent } from './components/customer-list/customer-list.component';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';


const materialModules = [
  MatCardModule,
  MatButtonModule,
  MatTableModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatToolbarModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatDividerModule
];

@NgModule({
  declarations: [
    // If CustomerListComponent or DashboardComponent were not standalone, they'd be declared here.
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    DashboardComponent, // DashboardComponent is standalone, so it's imported
    // CustomerListComponent, // If CustomerListComponent is used in routes and is standalone
    ...materialModules
  ],
  exports: [
    ...materialModules // Re-export Material modules for other modules importing AdminModule
  ]
})
export class AdminModule { }