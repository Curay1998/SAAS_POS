import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminSettingsService, AppSettings, UpdateSettingsPayload, Setting } from '../../services/admin-settings.service'; // Adjust path as necessary

@Component({
    selector: 'app-admin-settings',
    templateUrl: './admin-settings.component.html',
    styleUrls: ['./admin-settings.component.css']
})
export class AdminSettingsComponent implements OnInit {
    settingsForm: FormGroup;
    isLoading = true;
    errorMessage: string | null = null;
    successMessage: string | null = null;

    // Define the keys for the settings we expect to manage
    settingKeys = ['app_name', 'copyright_text', 'app_logo_url', 'landing_page_title', 'landing_page_subtitle'];

    constructor(
        private fb: FormBuilder,
        private adminSettingsService: AdminSettingsService
    ) {
        this.settingsForm = this.fb.group({});
        // Initialize form controls for each setting key
        this.settingKeys.forEach(key => {
            this.settingsForm.addControl(key, this.fb.control('', Validators.required));
        });
    }

    ngOnInit(): void {
        this.loadSettings();
    }

    loadSettings(): void {
        this.isLoading = true;
        this.errorMessage = null;
        this.adminSettingsService.getSettings().subscribe(
            (data: AppSettings) => {
                // Patch form values for existing settings
                this.settingKeys.forEach(key => {
                    if (data.hasOwnProperty(key)) {
                        this.settingsForm.get(key)?.patchValue(data[key]);
                    }
                });
                this.isLoading = false;
            },
            (error) => {
                console.error('Error fetching settings:', error);
                this.errorMessage = 'Failed to load settings. Please try again.';
                this.isLoading = false;
            }
        );
    }

    saveSettings(): void {
        if (this.settingsForm.invalid) {
            this.errorMessage = 'Please fill in all required fields.';
            return;
        }

        this.isLoading = true;
        this.errorMessage = null;
        this.successMessage = null;

        const formValues = this.settingsForm.value;
        const payloadSettings: Setting[] = this.settingKeys.map(key => ({
            key: key,
            value: formValues[key]
        }));

        const payload: UpdateSettingsPayload = { settings: payloadSettings };

        this.adminSettingsService.updateSettings(payload).subscribe(
            (updatedSettings: AppSettings) => {
                this.isLoading = false;
                this.successMessage = 'Settings saved successfully!';
                // Optionally re-patch form if backend modifies values (e.g., sanitization)
                this.settingKeys.forEach(key => {
                    if (updatedSettings.hasOwnProperty(key)) {
                        this.settingsForm.get(key)?.patchValue(updatedSettings[key]);
                    }
                });
                setTimeout(() => this.successMessage = null, 3000); // Clear message after 3s
            },
            (error) => {
                console.error('Error saving settings:', error);
                this.errorMessage = 'Failed to save settings. Please try again.';
                if (error.error && typeof error.error === 'object') {
                    // Display backend validation errors if available
                    const errors = error.error.errors;
                    if (errors) {
                        let messages = [];
                        for (const key in errors) {
                            messages.push(...errors[key]);
                        }
                        this.errorMessage = `Failed to save settings: ${messages.join(', ')}`;
                    }
                }
                this.isLoading = false;
            }
        );
    }
}
