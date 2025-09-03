import { Component, OnInit, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getVersion } from '@tauri-apps/api/app';

import { PageToolbarComponent } from '@app/components/toolbars/page-toolbar/page-toolbar.component';
import { UiService } from '@app/services/ui.service';

@Component({
  selector: 'app-about-page',
  imports: [PageToolbarComponent],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.sass',
})
export class AboutPageComponent implements OnInit {
  readonly #snackBar = inject(MatSnackBar);
  readonly uiService = inject(UiService);
  appVersion: string;

  constructor() {
    this.appVersion = 'Unknown';
  }

  ngOnInit(): void {
    getVersion()
      .then((version) => {
        this.appVersion = version;
      })
      .catch((error) => {
        this.#snackBar.open('Failed to determine version.', '', {
          duration: 3000,
        });
      });
  }
}
