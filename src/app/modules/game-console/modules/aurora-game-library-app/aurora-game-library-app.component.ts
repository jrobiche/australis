import { Component, Signal, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ROUTER_OUTLET_DATA } from '@angular/router';

import { GameConsoleConfiguration } from '@app/shared/types/app';
import { ListAndDetailsLayoutComponent } from './components/list-and-details-layout/list-and-details-layout.component';

@Component({
  selector: 'app-aurora-game-library-app',
  imports: [ListAndDetailsLayoutComponent],
  templateUrl: './aurora-game-library-app.component.html',
  styleUrl: './aurora-game-library-app.component.sass',
})
export class AuroraGameLibraryAppComponent {
  readonly #snackBar = inject(MatSnackBar);
  readonly gameConsoleConfiguration = inject(
    ROUTER_OUTLET_DATA,
  ) as Signal<GameConsoleConfiguration>;

  constructor() {}
}
