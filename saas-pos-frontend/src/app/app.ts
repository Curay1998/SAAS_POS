import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Required for routerLink
import { CommonModule } from '@angular/common'; // Required for *ngIf, async pipe
import { AuthService } from './auth/auth.service'; // Import AuthService

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: true, // Assuming AppComponent is standalone
  imports: [RouterModule, CommonModule] // Import RouterModule and CommonModule
})
export class AppComponent {
  title = 'saas-pos-frontend';

  constructor(public authService: AuthService) {} // Make authService public

  logout(): void {
    this.authService.logout();
    // Optionally navigate to login: this.router.navigate(['/login']);
  }
}
