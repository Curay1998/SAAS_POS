import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { LandingPage } from './landing-page/landing-page'; // Ensure this import is added

export const routes: Routes = [
  { path: '', component: LandingPage }, // New default route
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
