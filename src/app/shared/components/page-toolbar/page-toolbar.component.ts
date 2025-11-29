import { Component, Input, inject } from '@angular/core';
import { Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AppSettingsService } from '@app/shared/services/app-settings.service';

@Component({
  selector: 'app-page-toolbar',
  imports: [MatButtonModule, MatIconModule, MatToolbarModule],
  templateUrl: './page-toolbar.component.html',
  styleUrl: './page-toolbar.component.sass',
})
export class PageToolbarComponent {
  readonly #location = inject(Location);
  appSettings = inject(AppSettingsService);
  @Input({ required: true })
  heading: string;
  @Input()
  backButton: boolean;

  constructor() {
    this.backButton = true;
    this.heading = '';
  }

  onBackClick(): void {
    this.#location.back();
  }
}
