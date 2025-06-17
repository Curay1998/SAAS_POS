import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule

import { CustomerRoutingModule } from './customer-routing-module';
// PosComponent is standalone, so it imports CommonModule itself.

@NgModule({
  declarations: [
    // PosComponent is standalone
  ],
  imports: [
    CommonModule, // Add for any non-standalone components in this module
    CustomerRoutingModule
  ]
})
export class CustomerModule { }
