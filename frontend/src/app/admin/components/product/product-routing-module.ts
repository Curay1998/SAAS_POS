import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list'; // .ts is implicit
import { ProductFormComponent } from './components/product-form/product-form'; // .ts is implicit

const routes: Routes = [
  { path: '', component: ProductListComponent, pathMatch: 'full' }, // Default to list
  { path: 'new', component: ProductFormComponent },
  { path: 'edit/:id', component: ProductFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
