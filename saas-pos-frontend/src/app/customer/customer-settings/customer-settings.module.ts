import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule

import { CustomerSettingsRoutingModule } from './customer-settings-routing.module';
import { CustomerSettingsComponent } from './customer-settings.component';
// CustomerSettingsService is providedIn: 'root', so no need to provide it here unless scoped differently.

@NgModule({
  declarations: [
    CustomerSettingsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule, // Add HttpClientModule here for the service calls
    CustomerSettingsRoutingModule
  ]
})
export class CustomerSettingsModule { }
