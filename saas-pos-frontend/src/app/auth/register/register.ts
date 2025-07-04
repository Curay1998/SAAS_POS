import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', Validators.required],
      role: ['customer'] // Default role, could be hidden or selectable
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('password_confirmation');
    return password && confirmPassword && password.value === confirmPassword.value ? null : { mismatch: true };
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (this.registerForm.valid) {
      const { password_confirmation, ...userData } = this.registerForm.value;
      this.authService.register(userData).subscribe({
        next: (response) => {
          // Assuming registration logs the user in or navigates them to login
          this.router.navigate(['/login']); // Or to a dashboard if auto-login
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
          if (err.error?.errors) { // Handle Laravel validation errors
            let messages: string[] = [];
            for (const key in err.error.errors) {
              messages = messages.concat(err.error.errors[key]);
            }
            this.errorMessage = messages.join(' ');
          }
          console.error(err);
        }
      });
    }
  }
}
