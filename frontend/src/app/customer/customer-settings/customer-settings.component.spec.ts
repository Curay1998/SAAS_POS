import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { CustomerSettingsComponent } from './customer-settings.component';
import { CustomerSettingsService } from './customer-settings.service';
import { CustomerSetting } from './customer-setting.model';

describe('CustomerSettingsComponent', () => {
  let component: CustomerSettingsComponent;
  let fixture: ComponentFixture<CustomerSettingsComponent>;
  let mockSettingsService: jasmine.SpyObj<CustomerSettingsService>;

  const mockInitialSettings: CustomerSetting = {
    currency: 'USD',
    preferred_language: 'en',
  };

  beforeEach(async () => {
    mockSettingsService = jasmine.createSpyObj('CustomerSettingsService', ['getSettings', 'updateSettings']);

    mockSettingsService.getSettings.and.returnValue(of(mockInitialSettings));
    mockSettingsService.updateSettings.and.callFake((settings: Partial<CustomerSetting>) => {
      return of({ ...mockInitialSettings, ...settings });
    });

    await TestBed.configureTestingModule({
      declarations: [CustomerSettingsComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: CustomerSettingsService, useValue: mockSettingsService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSettingsComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges(); // Moved to individual tests for better control over ngOnInit call
  });

  it('should create', () => {
    fixture.detectChanges(); // Calls ngOnInit
    expect(component).toBeTruthy();
  });

  it('should load settings on init and patch the form', fakeAsync(() => {
    fixture.detectChanges(); // Calls ngOnInit
    tick(); // Complete async getSettings

    expect(mockSettingsService.getSettings).toHaveBeenCalledTimes(1);
    expect(component.settingsForm.value).toEqual({
      currency: 'USD',
      preferred_language: 'en'
    });
  }));

  it('should have correct default values in dropdowns after settings are loaded', fakeAsync(() => {
    fixture.detectChanges(); // ngOnInit
    tick(); // getSettings
    fixture.detectChanges(); // Update UI

    const compiled = fixture.nativeElement;
    const currencySelect = compiled.querySelector('#currency');
    const languageSelect = compiled.querySelector('#preferred_language');

    expect(currencySelect.value).toBe('USD');
    expect(languageSelect.value).toBe('en');
  }));

  it('should call updateSettings on valid form submission', fakeAsync(() => {
    fixture.detectChanges(); // ngOnInit
    tick(); // initial getSettings

    component.settingsForm.setValue({ currency: 'EUR', preferred_language: 'fr' });
    component.onSubmit();
    tick(); // updateSettings

    expect(mockSettingsService.updateSettings).toHaveBeenCalledWith({
      currency: 'EUR',
      preferred_language: 'fr'
    });
  }));

  it('should not call updateSettings on invalid form submission', () => {
    fixture.detectChanges(); // ngOnInit
    component.settingsForm.controls['currency'].setValue(''); // Invalid
    component.onSubmit();
    expect(mockSettingsService.updateSettings).not.toHaveBeenCalled();
  });

  it('should update the form with response from updateSettings on success', fakeAsync(() => {
    fixture.detectChanges(); // ngOnInit
    tick(); // initial getSettings

    const updatedDataFromServer: CustomerSetting = { currency: 'CAD', preferred_language: 'de' };
    mockSettingsService.updateSettings.and.returnValue(of(updatedDataFromServer));

    component.settingsForm.setValue({ currency: 'CAD', preferred_language: 'de' });
    component.onSubmit();
    tick(); // updateSettings

    // The component logic patches the form with the response
    expect(component.settingsForm.value.currency).toBe('CAD');
    expect(component.settingsForm.value.preferred_language).toBe('de');
  }));

  it('should log an error message when updateSettings fails', fakeAsync(() => {
    fixture.detectChanges(); // ngOnInit
    tick();

    spyOn(console, 'error');
    mockSettingsService.updateSettings.and.returnValue(throwError(() => new Error('Update failed')));

    component.settingsForm.setValue({ currency: 'EUR', preferred_language: 'fr' });
    component.onSubmit();
    tick();

    expect(console.error).toHaveBeenCalledWith('Error updating settings:', jasmine.any(Error));
  }));

  it('submit button should be disabled if form is invalid', () => {
    fixture.detectChanges(); // ngOnInit
    component.settingsForm.controls['currency'].setValue('');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBeTrue();
  });

  it('submit button should be enabled if form is valid (initially)', () => {
    fixture.detectChanges(); // ngOnInit - form is valid and pristine

    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBeFalse();
  });

  it('submit button should be enabled if form is valid and dirty', () => {
    fixture.detectChanges(); // ngOnInit
    component.settingsForm.controls['currency'].setValue('EUR'); // Make dirty
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBeFalse();
  });
});
