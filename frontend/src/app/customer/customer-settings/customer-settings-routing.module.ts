import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerSettingsComponent } from './customer-settings.component';

const routes: Routes = [
  {
    path: '', // Default route for this lazy-loaded module
    component: CustomerSettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerSettingsRoutingModule { }
