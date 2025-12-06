import { Component, Input, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AppSettingsService } from '@app/shared/services/app-settings.service';

@Component({
  selector: 'app-page-title-toolbar',
  imports: [MatToolbarModule],
  templateUrl: './page-title-toolbar.component.html',
  styleUrl: './page-title-toolbar.component.sass',
})
export class PageTitleToolbarComponent {
  appSettings = inject(AppSettingsService);
  @Input({ required: true })
  heading: string;

  constructor() {
    this.heading = '';
  }
}
