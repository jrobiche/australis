import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getVersion } from '@tauri-apps/api/app';
import { openUrl } from '@tauri-apps/plugin-opener';

import { AppSettingsService } from '@app/shared/services/app-settings.service';
import { PageToolbarComponent } from '@app/shared/components/page-toolbar/page-toolbar.component';

@Component({
  selector: 'app-about-page',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    PageToolbarComponent,
  ],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.sass',
})
export class AboutPageComponent {
  readonly #snackBar = inject(MatSnackBar);
  readonly appSettings = inject(AppSettingsService);
  #appVersion: string | null;

  constructor() {
    this.#appVersion = null;
  }

  ngOnInit(): void {
    getVersion()
      .then((version) => {
        this.#appVersion = version;
      })
      .catch((error) => {
        this.#snackBar.open('Failed to determine version.', '', {
          duration: 3000,
        });
      });
  }

  get appVersion(): string {
    if (this.#appVersion == null) {
      return 'Unknown';
    }
    return `v${this.#appVersion}`;
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
