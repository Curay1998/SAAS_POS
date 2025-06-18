import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CustomerRoutingModule } from './customer-routing-module';
import { PosComponent } from './components/pos/pos.component';

// Angular Material Modules - for potential direct declarations or re-export
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
// Add other common modules if CustomerModule itself is expected to declare components using them.

const commonMaterialModules = [
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule
];

@NgModule({
  declarations: [
    // Components declared directly in CustomerModule would go here
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomerRoutingModule,
    PosComponent, // PosComponent is standalone and handles its own Material imports
    ...commonMaterialModules
  ],
  exports: [
    ...commonMaterialModules // Re-export for other modules if needed
  ]
})
export class CustomerModule { }