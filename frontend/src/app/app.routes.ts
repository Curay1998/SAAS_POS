import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { LandingPageComponent } from './landing-page/landing-page.component'; // Ensure this import is added

export const routes: Routes = [
  { path: '', component: LandingPageComponent }, // New default route
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
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
  // { path: '', redirectTo: 'customer', pathMatch: 'full' }, // Default route - Replaced by LandingPageComponent
  { path: '**', redirectTo: '' } // Wildcard route redirecting to Landing Page
];
