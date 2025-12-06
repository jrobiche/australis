import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { GameConsoleConfiguration } from '@app/shared/types/app';
import { GameConsoleToolbarComponent } from '../game-console-toolbar/game-console-toolbar.component';

@Component({
  selector: 'app-game-console-page',
  imports: [RouterModule, GameConsoleToolbarComponent],
  templateUrl: './game-console-page.component.html',
  styleUrl: './game-console-page.component.sass',
})
export class GameConsolePageComponent implements OnInit {
  readonly #activatedRoute = inject(ActivatedRoute);
  gameConsoleConfiguration: GameConsoleConfiguration | null;

  constructor() {
    this.gameConsoleConfiguration = null;
  }

  ngOnInit() {
    this.gameConsoleConfiguration =
      this.#activatedRoute.snapshot.data['gameConsoleConfiguration'];
  }
}
