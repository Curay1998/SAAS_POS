import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { RegisterComponent } from './register';
import { AuthService } from '../auth.service';

import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let navigateSpy: any;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NoopAnimationsModule,
        RegisterComponent, // Standalone component
      ],
      providers: [AuthService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    navigateSpy = spyOn(component['router'], 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a register form with name, email, password, and password_confirmation controls', () => {
    expect(component.registerForm.contains('name')).toBeTrue();
    expect(component.registerForm.contains('email')).toBeTrue();
    expect(component.registerForm.contains('password')).toBeTrue();
    expect(component.registerForm.contains('password_confirmation')).toBeTrue();
  });

  it('form should be invalid when empty', () => {
    expect(component.registerForm.valid).toBeFalse();
  });

  it('name field validity', () => {
    const nameControl = component.registerForm.get('name');
    nameControl?.setValue('');
    expect(nameControl?.valid).toBeFalse();
    nameControl?.setValue('Test User');
    expect(nameControl?.valid).toBeTrue();
  });

  it('email field validity', () => {
    const emailControl = component.registerForm.get('email');
    emailControl?.setValue('');
    expect(emailControl?.valid).toBeFalse();
    emailControl?.setValue('test');
    expect(emailControl?.hasError('email')).toBeTrue();
    emailControl?.setValue('test@example.com');
    expect(emailControl?.valid).toBeTrue();
  });

  it('password field validity - required and minlength', () => {
    const passwordControl = component.registerForm.get('password');
    passwordControl?.setValue('');
    expect(passwordControl?.valid).toBeFalse();
    passwordControl?.setValue('12345');
    expect(passwordControl?.hasError('minlength')).toBeTrue();
    passwordControl?.setValue('12345678');
    expect(passwordControl?.valid).toBeTrue();
  });

  it('password_confirmation field validity and password matching', () => {
    const passwordControl = component.registerForm.get('password');
    const confirmPasswordControl = component.registerForm.get('password_confirmation');

    passwordControl?.setValue('12345678');
    confirmPasswordControl?.setValue('');
    expect(confirmPasswordControl?.valid).toBeFalse(); // Required

    confirmPasswordControl?.setValue('12345678');
    expect(component.registerForm.hasError('mismatch')).toBeFalse();

    confirmPasswordControl?.setValue('87654321');
    expect(component.registerForm.hasError('mismatch')).toBeTrue();
  });

  it('should disable register button when form is invalid', () => {
    const registerButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(registerButton.nativeElement.disabled).toBeTrue();

    component.registerForm.get('name')?.setValue('Test User');
    component.registerForm.get('email')?.setValue('test@example.com');
    component.registerForm.get('password')?.setValue('password123');
    component.registerForm.get('password_confirmation')?.setValue('password123');
    fixture.detectChanges();
    expect(registerButton.nativeElement.disabled).toBeFalse();
  });

  it('should display "Register" in mat-card-title', () => {
    const cardTitle = fixture.debugElement.query(By.css('mat-card-title'));
    expect(cardTitle.nativeElement.textContent).toContain('Register');
  });

  it('should call AuthService.register on submit with valid form', () => {
    spyOn(authService, 'register').and.returnValue(of({ user: { role: 'customer' } }));
    component.registerForm.setValue({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      password_confirmation: 'password123',
      role: 'customer'
    });
    component.onSubmit();
    const { password_confirmation, ...expectedPayload } = component.registerForm.value;
    expect(authService.register).toHaveBeenCalledWith(expectedPayload);
  });

  it('should navigate to /customer on successful customer registration', () => {
    spyOn(authService, 'register').and.returnValue(of({ user: { name: 'Test', role: 'customer' } }));
    component.registerForm.setValue({
        name: 'Test User',
        email: 'customer@example.com',
        password: 'password',
        password_confirmation: 'password',
        role: 'customer'
    });
    component.onSubmit();
    expect(navigateSpy).toHaveBeenCalledWith(['/customer']);
  });

  it('should display error message on registration failure', () => {
    spyOn(authService, 'register').and.returnValue(throwError(() => ({ error: { message: 'Email already taken' } })));
    component.registerForm.setValue({
        name: 'Test User',
        email: 'taken@example.com',
        password: 'password',
        password_confirmation: 'password',
        role: 'customer'
    });
    component.onSubmit();
    fixture.detectChanges();
    expect(component.errorMessage).toBe('Email already taken');
    const errorMessageElement = fixture.debugElement.query(By.css('.error-message'));
    expect(errorMessageElement.nativeElement.textContent).toContain('Email already taken');
  });

  it('should display Laravel validation errors correctly', () => {
    const laravelErrors = {
      message: "Validation errors",
      errors: {
        email: ["The email has already been taken."],
        name: ["The name field is required."]
      }
    };
    spyOn(authService, 'register').and.returnValue(throwError(() => ({ error: laravelErrors })));
     component.registerForm.setValue({
        name: '',
        email: 'taken@example.com',
        password: 'password',
        password_confirmation: 'password',
        role: 'customer'
    });
    component.onSubmit();
    fixture.detectChanges();
    expect(component.errorMessage).toBe("The email has already been taken. The name field is required.");
  });


  it('should have a link to the login page', () => {
    const loginLink = fixture.debugElement.query(By.css('a[routerLink="/login"]'));
    expect(loginLink).toBeTruthy();
    expect(loginLink.nativeElement.textContent).toContain('Login here');
  });
});
