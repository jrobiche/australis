import { Component } from '@angular/core';

import { NavigationLink } from '@app/shared/types/app';
import { NavigationListComponent } from '@app/shared/components/navigation-list/navigation-list.component';
import { PageTitleToolbarComponent } from '@app/shared/components/page-title-toolbar/page-title-toolbar.component';
import { ResponsiveWidthContainerComponent } from '@app/shared/components/responsive-width-container/responsive-width-container.component';

@Component({
  selector: 'app-game-console-app-navigation',
  imports: [
    NavigationListComponent,
    PageTitleToolbarComponent,
    ResponsiveWidthContainerComponent,
  ],
  templateUrl: './game-console-app-navigation.component.html',
  styleUrl: './game-console-app-navigation.component.sass',
})
export class GameConsoleAppNavigationComponent {
  links: NavigationLink[];

  constructor() {
    this.links = [
      { routerLink: 'assets', title: 'Asset Manager' },
      { routerLink: 'games', title: 'Game Library' },
      { routerLink: 'system', title: 'System Information' },
      { routerLink: 'telnet', title: 'Telnet Client' },
    ];
  }
}
