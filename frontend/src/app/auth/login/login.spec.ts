import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { LoginComponent } from './login';
import { AuthService } from '../auth.service';

// Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let navigateSpy: any;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]), // Basic router setup for routerLink
        HttpClientTestingModule,
        NoopAnimationsModule, // Disable animations for tests
        LoginComponent, // Import the standalone component directly
        // Individual Material modules are imported by LoginComponent itself as it's standalone
      ],
      providers: [
        AuthService
        // Router can be spied upon from the component instance if needed
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    // Spy on router navigation
    navigateSpy = spyOn(component['router'], 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a login form with email and password controls', () => {
    expect(component.loginForm.contains('email')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
  });

  it('email field should be invalid when empty and valid when format is correct', () => {
    const emailControl = component.loginForm.get('email');
    expect(emailControl?.valid).toBeFalse(); // Initially empty
    emailControl?.setValue('test');
    expect(emailControl?.valid).toBeFalse(); // Invalid email format
    emailControl?.setValue('test@example.com');
    expect(emailControl?.valid).toBeTrue();
  });

  it('password field should be invalid when empty', () => {
    const passwordControl = component.loginForm.get('password');
    expect(passwordControl?.valid).toBeFalse(); // Initially empty
    passwordControl?.setValue('password123');
    expect(passwordControl?.valid).toBeTrue();
  });

  it('should disable login button when form is invalid', () => {
    fixture.detectChanges(); // Update view with form state
    const loginButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(loginButton.nativeElement.disabled).toBeTrue();

    component.loginForm.get('email')?.setValue('test@example.com');
    component.loginForm.get('password')?.setValue('password123');
    fixture.detectChanges();
    expect(loginButton.nativeElement.disabled).toBeFalse();
  });

  it('should display "Login" in mat-card-title', () => {
    const cardTitle = fixture.debugElement.query(By.css('mat-card-title'));
    expect(cardTitle.nativeElement.textContent).toContain('Login');
  });

  it('should have mat-form-fields for email and password', () => {
    const emailFormField = fixture.debugElement.query(By.css('mat-form-field input[formControlName="email"]'));
    const passwordFormField = fixture.debugElement.query(By.css('mat-form-field input[formControlName="password"]'));
    expect(emailFormField).toBeTruthy();
    expect(passwordFormField).toBeTruthy();
  });

  it('should call AuthService.login on submit with valid form', () => {
    spyOn(authService, 'login').and.returnValue(of({ user: { role: 'customer' } }));
    component.loginForm.get('email')?.setValue('test@example.com');
    component.loginForm.get('password')?.setValue('password123');
    component.onSubmit();
    expect(authService.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
  });

  it('should navigate to /customer on successful customer login', () => {
    spyOn(authService, 'login').and.returnValue(of({ user: { name: 'Test', role: 'customer' } }));
    component.loginForm.get('email')?.setValue('customer@example.com');
    component.loginForm.get('password')?.setValue('password');
    component.onSubmit();
    expect(navigateSpy).toHaveBeenCalledWith(['/customer']);
  });

  it('should navigate to /admin on successful admin login', () => {
    spyOn(authService, 'login').and.returnValue(of({ user: { name: 'Admin', role: 'admin' } }));
    component.loginForm.get('email')?.setValue('admin@example.com');
    component.loginForm.get('password')?.setValue('password');
    component.onSubmit();
    expect(navigateSpy).toHaveBeenCalledWith(['/admin']);
  });

  it('should display error message on login failure', () => {
    spyOn(authService, 'login').and.returnValue(throwError(() => ({ error: { message: 'Invalid credentials' } })));
    component.loginForm.get('email')?.setValue('wrong@example.com');
    component.loginForm.get('password')?.setValue('wrongpassword');
    component.onSubmit();
    fixture.detectChanges();
    expect(component.errorMessage).toBe('Invalid credentials');
    const errorMessageElement = fixture.debugElement.query(By.css('.error-message'));
    expect(errorMessageElement.nativeElement.textContent).toContain('Invalid credentials');
  });

  it('should have a link to the register page', () => {
    const registerLink = fixture.debugElement.query(By.css('a[routerLink="/register"]'));
    expect(registerLink).toBeTruthy();
    expect(registerLink.nativeElement.textContent).toContain('Register here');
  });
});
