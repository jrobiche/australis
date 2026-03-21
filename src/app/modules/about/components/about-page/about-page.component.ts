import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { NotificationCardComponent } from '@app/shared/components/notification-card/notification-card.component';
import { PageToolbarComponent } from '@app/shared/components/page-toolbar/page-toolbar.component';
import { ResponsiveWidthContainerComponent } from '@app/shared/components/responsive-width-container/responsive-width-container.component';
import { AppSettingsService } from '@app/shared/services/app-settings.service';
import { AppService } from '@app/shared/services/app.service';
import { DialogService } from '@app/shared/services/dialog.service';
import { ConfirmationDialogData } from '@app/shared/types/app';
import { getName, getVersion } from '@tauri-apps/api/app';
import { openUrl } from '@tauri-apps/plugin-opener';

@Component({
  selector: 'app-about-page',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatListModule,
    NotificationCardComponent,
    PageToolbarComponent,
    ResponsiveWidthContainerComponent,
  ],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.sass',
})
export class AboutPageComponent {
  readonly #appService = inject(AppService);
  readonly appSettings = inject(AppSettingsService);
  readonly #dialogService = inject(DialogService);
  readonly #httpClient = inject(HttpClient);
  #appCacheSize: number | null;
  #appDataSize: number | null;
  #appName: string | null;
  #appVersion: string | null;
  #gplText: string | null;
  errorMessages: string[];

  constructor() {
    this.#appCacheSize = null;
    this.#appDataSize = null;
    this.#appName = null;
    this.#appVersion = null;
    this.#gplText = null;
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
    this.#loadAppCacheSize();
    this.#loadAppDataSize();
    this.#loadGPL();
  }

  get appCacheSizeText(): string {
    if (this.#appCacheSize == null) {
      return 'Unknown';
    }
    return this.#fileSizeSI(this.#appCacheSize);
  }

  get appDataSizeText(): string {
    if (this.#appDataSize == null) {
      return 'Unknown';
    }
    return this.#fileSizeSI(this.#appDataSize);
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

  get gplText(): string {
    if (this.#gplText == null) {
      return 'Unknown';
    }
    return this.#gplText;
  }

  onClearCacheClick(): void {
    let dialogData: ConfirmationDialogData = {
      title: 'Clear Cache',
      bodyParagraphs: ['Delete all files in cache?'],
      confirmButtonText: 'Yes',
    };
    this.#dialogService
      .openConfirmationDialog(dialogData)
      .subscribe((result) => {
        if (result) {
          this.#appService
            .clearCache()
            .then(() => {
              this.#loadAppCacheSize();
            })
            .catch((error) => {
              console.error(
                'Failed to clear cache. Got the following error:',
                error,
              );
              this.errorMessages.push('Failed to clear cache.');
            });
        }
      });
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

  #fileSizeSI(bytes: number): string {
    const exponent = Math.floor(
      Math.max(Math.log(bytes), 0.1) / Math.log(1000.0),
    );
    const decimal = (bytes / Math.pow(1000.0, exponent)).toFixed(
      exponent ? 2 : 0,
    );
    return `${decimal} ${exponent ? `${'kMGTPEZY'[exponent - 1]}B` : 'B'}`;
  }

  #loadAppCacheSize(): void {
    this.#appService
      .appCacheSize()
      .then((response) => {
        this.#appCacheSize = response;
      })
      .catch((error) => {
        console.error(
          'Failed to determine application cache size. Got the following error:',
          error,
        );
        this.errorMessages.push('Failed to determine application cache size.');
      });
  }

  #loadAppDataSize(): void {
    this.#appService
      .appDataSize()
      .then((response) => {
        this.#appDataSize = response;
      })
      .catch((error) => {
        console.error(
          'Failed to determine application data size. Got the following error:',
          error,
        );
        this.errorMessages.push('Failed to determine application data size.');
      });
  }

  #loadGPL(): void {
    this.#httpClient
      .get('/assets/licenses/gpl-3.0.txt', { responseType: 'text' })
      .subscribe((data: string) => {
        this.#gplText = data;
      });
  }
}
