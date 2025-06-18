import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerSettingsService } from './customer-settings.service';
// import { CustomerSetting } from './customer-setting.model'; // Not directly used if service handles types
// Removed MatProgressBarModule as it's imported in CustomerSettingsModule
// Removed MatCardModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatIconModule as they are in CustomerSettingsModule

@Component({
  selector: 'app-customer-settings',
  templateUrl: './customer-settings.component.html',
  styleUrls: ['./customer-settings.component.css']
  // No 'imports' array needed here as this is not a standalone component
})
export class CustomerSettingsComponent implements OnInit {
  settingsForm!: FormGroup; // Definite assignment assertion
  isLoading: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
  ];
  languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
  ];

  constructor(
    private fb: FormBuilder,
    private settingsService: CustomerSettingsService
  ) { }

  ngOnInit(): void {
    this.settingsForm = this.fb.group({
      currency: ['', Validators.required],
      preferred_language: ['', Validators.required]
    });
    this.loadSettings();
  }

  loadSettings(): void {
    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;
    this.settingsService.getSettings().subscribe(
      data => {
        this.settingsForm.patchValue(data);
        this.isLoading = false;
      },
      error => {
        console.error('Error loading settings:', error);
        this.errorMessage = 'Failed to load settings. Please try again later.';
        this.isLoading = false;
      }
    );
  }

  onSubmit(): void {
    this.successMessage = null;
    this.errorMessage = null;
    if (this.settingsForm.valid) {
      this.isLoading = true;
      this.settingsService.updateSettings(this.settingsForm.value).subscribe(
        updatedSettings => {
          console.log('Settings updated:', updatedSettings);
          this.settingsForm.patchValue(updatedSettings);
          this.successMessage = 'Settings saved successfully!';
          this.isLoading = false;
          setTimeout(() => this.successMessage = null, 3000); // Clear message after 3s
        },
        error => {
          console.error('Error updating settings:', error);
          this.errorMessage = 'Failed to save settings. Please try again.';
          this.isLoading = false;
        }
      );
    } else {
      this.settingsForm.markAllAsTouched();
    }
  }
}
