import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CustomerRoutingModule } from './customer-routing-module';
import { PosComponent } from './components/pos/pos.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomerRoutingModule,
    PosComponent
  ]
})
export class CustomerModule { }