import { Component, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

import { GameConsoleConfiguration } from '@app/shared/types/app';

@Component({
  selector: 'app-console-navigation-list',
  imports: [MatListModule, RouterModule],
  templateUrl: './console-navigation-list.component.html',
  styleUrl: './console-navigation-list.component.sass',
})
export class ConsoleNavigationListComponent {
  @Input({ required: true })
  configurations: GameConsoleConfiguration[];

  constructor() {
    this.configurations = [];
  }
}
