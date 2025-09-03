import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { PageToolbarComponent } from '@app/components/toolbars/page-toolbar/page-toolbar.component';
import { UiService } from '@app/services/ui.service';

@Component({
  selector: 'app-not-found-page',
  imports: [MatButtonModule, PageToolbarComponent, RouterModule],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.sass',
})
export class NotFoundPageComponent {
  readonly uiService = inject(UiService);
}
