import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CartViewComponent } from './components/cart-view/cart-view.component';
import { CheckoutFormComponent } from './components/checkout-form/checkout-form.component';
import { OrderConfirmationComponent } from './components/order-confirmation/order-confirmation.component';

export const routes: Routes = [
  { path: 'products', component: ProductListComponent },
  { path: 'cart', component: CartViewComponent },
  { path: 'checkout', component: CheckoutFormComponent },
  { path: 'order-confirmation/:id', component: OrderConfirmationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // Existing routes follow
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
    // Add AuthGuard here later: canActivate: [AuthGuard], data: { roles: ['admin'] }
  },
  {
    path: 'customer',
    loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule)
    // Add AuthGuard here later: canActivate: [AuthGuard], data: { roles: ['customer', 'admin'] }
  },
  { path: '', redirectTo: 'customer', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: 'customer' } // Wildcard route
];
