import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PosComponent } from './components/pos/pos.component';

const routes: Routes = [
  { path: '', component: PosComponent },
  {
    path: 'settings',
    loadChildren: () => import('./customer-settings/customer-settings.module').then(m => m.CustomerSettingsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
