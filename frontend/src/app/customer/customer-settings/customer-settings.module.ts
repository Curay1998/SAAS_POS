import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule

import { CustomerSettingsRoutingModule } from './customer-settings-routing.module';
import { CustomerSettingsComponent } from './customer-settings.component';
// CustomerSettingsService is providedIn: 'root', so no need to provide it here unless scoped differently.

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input'; // Though not used directly by select, good for consistency
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar'; // For loading indicator
import { RouterModule } from '@angular/router'; // Import RouterModule

@NgModule({
  declarations: [
    CustomerSettingsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule, // Add HttpClientModule here for the service calls
    CustomerSettingsRoutingModule,
    RouterModule, // Add RouterModule
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatProgressBarModule
  ]
})
export class CustomerSettingsModule { }
