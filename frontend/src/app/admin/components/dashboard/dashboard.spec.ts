import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatTableHarness } from '@angular/material/table/testing';
import { MatPaginatorHarness } from '@angular/material/paginator/testing'; // If using paginator
import { MatCardHarness } from '@angular/material/card/testing';


import { DashboardComponent } from './dashboard';
import { CustomerAdminService, AdminCustomerView } from '../../services/customer-admin.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

const mockCustomers: AdminCustomerView[] = [
  { id: 1, name: 'Alice Wonderland', email: 'alice@example.com', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 2, name: 'Bob The Builder', email: 'bob@example.com', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let customerAdminService: CustomerAdminService;
  let loader: HarnessLoader;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        NoopAnimationsModule,
        DashboardComponent, // Standalone component
      ],
      providers: [CustomerAdminService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    customerAdminService = TestBed.inject(CustomerAdminService);
    loader = TestbedHarnessEnvironment.loader(fixture);

    spyOn(customerAdminService, 'getCustomers').and.returnValue(of(mockCustomers));
    spyOn(customerAdminService, 'createCustomer').and.callFake((data: any) => of({ ...data, id: 3, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }));
    spyOn(customerAdminService, 'updateCustomer').and.callFake((id: number, data: any) => of({ ...data, id, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }));
    spyOn(customerAdminService, 'deleteCustomer').and.returnValue(of(undefined));


    fixture.detectChanges(); // This calls ngOnInit -> loadCustomers
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load customers on init', fakeAsync(() => {
    tick(); // Simulate passage of time for async operations in ngOnInit
    fixture.detectChanges();
    expect(customerAdminService.getCustomers).toHaveBeenCalled();
    expect(component.customers.length).toBe(2);
    expect(component.customers[0].name).toBe('Alice Wonderland');
  }));

  it('should display customers in the mat-table', async () => {
    const tableHarness = await loader.getHarness(MatTableHarness);
    const rows = await tableHarness.getRows();
    expect(rows.length).toBe(2);
    const firstRowCells = await rows[0].getCellTextByIndex();
    expect(firstRowCells[1]).toBe('Alice Wonderland'); // Name column
    expect(firstRowCells[2]).toBe('alice@example.com'); // Email column
  });

  it('should have a form for adding/editing customers with Material components', async () => {
    const cardHarness = await loader.getHarness(MatCardHarness.with({ selector: '.form-card' }));
    expect(cardHarness).toBeTruthy();
    const nameInput = await loader.getHarness(MatInputHarness.with({ selector: 'input[formControlName="name"]' }));
    expect(nameInput).toBeTruthy();
    const emailInput = await loader.getHarness(MatInputHarness.with({ selector: 'input[formControlName="email"]' }));
    expect(emailInput).toBeTruthy();
    const passwordInput = await loader.getHarness(MatInputHarness.with({ selector: 'input[formControlName="password"]' }));
    expect(passwordInput).toBeTruthy();
  });

  it('should allow adding a new customer', fakeAsync(() => {
    component.customerForm.setValue({ name: 'Charlie Brown', email: 'charlie@example.com', password: 'password123' });
    component.onSubmit();
    tick();
    fixture.detectChanges();

    expect(customerAdminService.createCustomer).toHaveBeenCalled();
    // Assuming loadCustomers is called after successful creation
    expect(customerAdminService.getCustomers).toHaveBeenCalledTimes(2); // Once on init, once after create
  }));

   it('should display "Add New Customer" in form card title when not editing', () => {
    component.onCancelEdit(); // Ensure not in edit mode
    fixture.detectChanges();
    const cardTitle = fixture.debugElement.query(By.css('.form-card mat-card-title'));
    expect(cardTitle.nativeElement.textContent).toContain('Add New Customer');
  });

  it('should switch to edit mode when onEdit is called', fakeAsync(() => {
    component.onEdit(mockCustomers[0]);
    tick();
    fixture.detectChanges();

    expect(component.editingCustomer).toEqual(mockCustomers[0]);
    expect(component.customerForm.get('name')?.value).toBe(mockCustomers[0].name);
    const cardTitle = fixture.debugElement.query(By.css('.form-card mat-card-title'));
    expect(cardTitle.nativeElement.textContent).toContain('Edit Customer');
    const passwordInput = fixture.debugElement.query(By.css('input[formControlName="password"]'));
    expect(passwordInput.nativeElement.placeholder).toContain('Leave blank to keep current');
  }));


  it('should allow updating an existing customer', fakeAsync(() => {
    component.onEdit(mockCustomers[0]); // Enter edit mode
    tick();
    fixture.detectChanges();

    component.customerForm.patchValue({ name: 'Alice Updated', password: 'newpassword123' });
    component.onSubmit();
    tick();
    fixture.detectChanges();

    expect(customerAdminService.updateCustomer).toHaveBeenCalled();
    expect(customerAdminService.getCustomers).toHaveBeenCalledTimes(2); // Init and after update
  }));

  it('should require password for new user but not for update if blank', fakeAsync(() => {
    // New user
    component.onCancelEdit(); // Ensure not editing
    component.customerForm.setValue({ name: 'New User', email: 'new@example.com', password: '' });
    component.onSubmit();
    tick();
    expect(component.errorMessage).toContain('Password must be at least 8 characters for new users.');
    expect(customerAdminService.createCustomer).not.toHaveBeenCalled();

    // Existing user - password blank (no change)
    component.onEdit(mockCustomers[0]);
    tick();
    component.customerForm.patchValue({ name: 'Alice Updated', password: '' }); // Password blank
    component.onSubmit();
    tick();
    expect(customerAdminService.updateCustomer).toHaveBeenCalledWith(mockCustomers[0].id!, {name: 'Alice Updated', email: mockCustomers[0].email});
    expect(component.errorMessage).toBeNull();
  }));


  it('should allow deleting a customer', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(true);
    const customerToDelete = mockCustomers[0];
    component.onDelete(customerToDelete.id);
    tick();
    fixture.detectChanges();

    expect(window.confirm).toHaveBeenCalled();
    expect(customerAdminService.deleteCustomer).toHaveBeenCalledWith(customerToDelete.id);
    expect(customerAdminService.getCustomers).toHaveBeenCalledTimes(2); // Init and after delete
  }));

  it('should display error message if loading customers fails', fakeAsync(() => {
    (customerAdminService.getCustomers as jasmine.Spy).and.returnValue(throwError(() => new Error('Failed to load')));
    component.ngOnInit(); // Manually call as first call was spied on
    tick();
    fixture.detectChanges();
    expect(component.errorMessage).toContain('Failed to load customers');
  }));

  it('should have a refresh button that calls loadCustomers', async () => {
    spyOn(component, 'loadCustomers').and.callThrough();
    const refreshButton = await loader.getHarness(MatButtonHarness.with({ selector: 'button[matTooltip="Refresh List"]' }));
    await refreshButton.click();
    expect(component.loadCustomers).toHaveBeenCalled();
  });

  it('should have a link to view customers page', () => {
    const link = fixture.debugElement.query(By.css('a[routerLink="/admin/customers"]'));
    expect(link).toBeTruthy();
    expect(link.nativeElement.textContent).toContain('View Customers Page');
  });

});
