import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerSettingsService } from './customer-settings.service';
import { CustomerSetting } from './customer-setting.model';

@Component({
  selector: 'app-customer-settings',
  templateUrl: './customer-settings.component.html',
  styleUrls: ['./customer-settings.component.css']
})
export class CustomerSettingsComponent implements OnInit {
  settingsForm!: FormGroup; // Definite assignment assertion

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
    this.settingsService.getSettings().subscribe(
      data => {
        this.settingsForm.patchValue(data);
      },
      error => {
        console.error('Error loading settings:', error);
        // Optionally, display a message to the user
      }
    );
  }

  onSubmit(): void {
    if (this.settingsForm.valid) {
      this.settingsService.updateSettings(this.settingsForm.value).subscribe(
        updatedSettings => {
          console.log('Settings updated:', updatedSettings);
          this.settingsForm.patchValue(updatedSettings); // Update form with server response
          // Optionally, display a success message to the user
        },
        error => {
          console.error('Error updating settings:', error);
          // Optionally, display an error message to the user
        }
      );
    } else {
      // Mark all fields as touched to display validation errors
      this.settingsForm.markAllAsTouched();
    }
  }
}
