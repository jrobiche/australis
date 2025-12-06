import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

import { PageTitleToolbarComponent } from '@app/shared/components/page-title-toolbar/page-title-toolbar.component';

@Component({
  selector: 'app-game-console-app-navigation-list',
  imports: [MatListModule, RouterModule, PageTitleToolbarComponent],
  templateUrl: './game-console-app-navigation-list.component.html',
  styleUrl: './game-console-app-navigation-list.component.sass',
})
export class GameConsoleAppNavigationListComponent {
  links = [
    { route: 'assets', title: 'Asset Manager' },
    { route: 'games', title: 'Game Library' },
    { route: 'system', title: 'System Information' },
  ];
}
