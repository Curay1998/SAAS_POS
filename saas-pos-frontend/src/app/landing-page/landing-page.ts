import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PublicAppSettingsService, AppSettings } from '../services/public-app-settings.service'; // Adjusted path

@Component({
  selector: 'app-landing-page',
  // imports: [], // imports array is for standalone components, remove if not standalone or manage in module
  templateUrl: './landing-page.html',
  styleUrls: ['./landing-page.css'] // Changed styleUrl to styleUrls
})
export class LandingPage implements OnInit, OnDestroy { // Renamed class to LandingPageComponent for convention, but will keep LandingPage to match original
    settings: AppSettings | null = null;
    private settingsSub: Subscription | undefined;

    // For easier template access, you can also have individual properties:
    appName: string = 'Welcome'; // Default
    copyrightText: string = '© Your Company'; // Default
    appLogoUrl: string | null = null;
    landingPageTitle: string = 'Discover Our Amazing Service'; // Default
    landingPageSubtitle: string = 'The best solution for your needs.'; // Default

    constructor(private publicAppSettingsService: PublicAppSettingsService) {}

    ngOnInit(): void {
        this.settingsSub = this.publicAppSettingsService.settings$.subscribe(currentSettings => {
            this.settings = currentSettings;
            if (currentSettings) {
                this.appName = currentSettings['app_name'] || this.appName;
                this.copyrightText = currentSettings['copyright_text'] || this.copyrightText;
                this.appLogoUrl = currentSettings['app_logo_url'] || null;
                this.landingPageTitle = currentSettings['landing_page_title'] || this.landingPageTitle;
                this.landingPageSubtitle = currentSettings['landing_page_subtitle'] || this.landingPageSubtitle;
            }
        });
    }

    ngOnDestroy(): void {
        if (this.settingsSub) {
            this.settingsSub.unsubscribe();
        }
    }
}
