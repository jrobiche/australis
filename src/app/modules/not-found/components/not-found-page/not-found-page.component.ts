import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { AppSettingsService } from '@app/shared/services/app-settings.service';
import { PageTitleToolbarComponent } from '@app/shared/components/page-title-toolbar/page-title-toolbar.component';
import { PageToolbarComponent } from '@app/shared/components/page-toolbar/page-toolbar.component';

@Component({
  selector: 'app-not-found-page',
  imports: [
    MatButtonModule,
    RouterModule,
    PageTitleToolbarComponent,
    PageToolbarComponent,
  ],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.sass',
})
export class NotFoundPageComponent {
  readonly appSettings = inject(AppSettingsService);
}
