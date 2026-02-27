import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

import { PageTitleToolbarComponent } from '@app/shared/components/page-title-toolbar/page-title-toolbar.component';
import { ResponsiveWidthContainerComponent } from '@app/shared/components/responsive-width-container/responsive-width-container.component';

@Component({
  selector: 'app-game-console-app-navigation-list',
  imports: [
    MatIconModule,
    MatListModule,
    RouterModule,
    PageTitleToolbarComponent,
    ResponsiveWidthContainerComponent,
  ],
  templateUrl: './game-console-app-navigation-list.component.html',
  styleUrl: './game-console-app-navigation-list.component.sass',
})
export class GameConsoleAppNavigationListComponent {
  links = [
    { route: 'assets', title: 'Asset Manager' },
    { route: 'games', title: 'Game Library' },
    { route: 'system', title: 'System Information' },
    { route: 'telnet', title: 'Telnet Client' },
  ];
}
