import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { getName, getVersion } from '@tauri-apps/api/app';
import { openUrl } from '@tauri-apps/plugin-opener';

import { AppSettingsService } from '@app/shared/services/app-settings.service';
import { NotificationCardComponent } from '@app/shared/components/notification-card/notification-card.component';
import { PageToolbarComponent } from '@app/shared/components/page-toolbar/page-toolbar.component';
import { ResponsiveWidthContainerComponent } from '@app/shared/components/responsive-width-container/responsive-width-container.component';

@Component({
  selector: 'app-about-page',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    NotificationCardComponent,
    PageToolbarComponent,
    ResponsiveWidthContainerComponent,
  ],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.sass',
})
export class AboutPageComponent {
  readonly appSettings = inject(AppSettingsService);
  #appName: string | null;
  #appVersion: string | null;
  errorMessages: string[];

  constructor() {
    this.#appName = null;
    this.#appVersion = null;
    this.errorMessages = [];
  }

  ngOnInit(): void {
    getName()
      .then((name) => {
        this.#appName = name;
      })
      .catch((error) => {
        console.error(
          'Failed to get application name. Got the following error:',
          error,
        );
        this.errorMessages.push('Failed to determine application name.');
      });
    getVersion()
      .then((version) => {
        this.#appVersion = version;
      })
      .catch((error) => {
        console.error(
          'Failed to get application version. Got the following error:',
          error,
        );
        this.errorMessages.push('Failed to determine application version.');
      });
  }

  get appName(): string {
    if (this.#appName == null) {
      return 'Unknown';
    }
    return this.#appName;
  }

  get appVersion(): string {
    if (this.#appVersion == null) {
      return 'Unknown';
    }
    return `v${this.#appVersion}`;
  }

  onErrorDismissed(index: number): void {
    this.errorMessages.splice(index, 1);
  }

  openGitHubIssues(): void {
    openUrl('https://github.com/jrobiche/australis/issues');
  }

  openGPL(): void {
    openUrl('https://www.gnu.org/licenses/#GPL');
  }

  openSourceCode(): void {
    openUrl('https://github.com/jrobiche/australis');
  }
}
