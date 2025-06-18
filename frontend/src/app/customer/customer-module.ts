import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule

import { CustomerRoutingModule } from './customer-routing-module';
import { CustomerSettingsModule } from './customer-settings/customer-settings.module'; // Import the new module
// PosComponent is standalone, so it imports CommonModule itself.

@NgModule({
  declarations: [
    // PosComponent is standalone
  ],
  imports: [
    CommonModule, // Add for any non-standalone components in this module
    CustomerRoutingModule,
    CustomerSettingsModule // Add the new module to imports
  ]
})
export class CustomerModule { }
