import { Component, Input } from '@angular/core';

import { GameConsoleConfiguration } from '@app/types/app';
import { ListAndDetailsLayoutComponent } from './layouts/list-and-details-layout/list-and-details-layout.component';

@Component({
  selector: 'app-game-library',
  imports: [ListAndDetailsLayoutComponent],
  templateUrl: './game-library.component.html',
  styleUrl: './game-library.component.sass',
})
export class GameLibraryComponent {
  @Input({ required: true })
  gameConsoleConfiguration!: GameConsoleConfiguration;

  constructor() {}
}
