import { AsyncPipe } from '@angular/common';
import { Component, Input, ModelSignal, inject, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { BreakpointService } from '@app/shared/services/breakpoint.service';
import { DialogService } from '@app/shared/services/dialog.service';
import { GameConsoleConfigurationStoreService } from '@app/shared/services/game-console-configuration-store.service';

import { GameConsoleConfiguration } from '@app/shared/types/app';
import { PageToolbarComponent } from '@app/shared/components/page-toolbar/page-toolbar.component';

@Component({
  selector: 'app-game-console-toolbar',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    PageToolbarComponent,
  ],
  templateUrl: './game-console-toolbar.component.html',
  styleUrl: './game-console-toolbar.component.sass',
})
export class GameConsoleToolbarComponent {
  readonly #dialogService = inject(DialogService);
  readonly #gameConsoleConfigurationStore = inject(
    GameConsoleConfigurationStoreService,
  );
  readonly #router = inject(Router);
  readonly #snackBar = inject(MatSnackBar);
  readonly breakpointService = inject(BreakpointService);
  gameConsoleConfiguration = model<GameConsoleConfiguration | null>(null);

  constructor() {}

  get isDeleteConsoleDisabled(): boolean {
    return this.gameConsoleConfiguration() == null;
  }

  get isEditConsoleDisabled(): boolean {
    return this.gameConsoleConfiguration() == null;
  }

  get heading(): string {
    return this.gameConsoleConfiguration()?.name ?? 'Unknown';
  }

  onDeleteConsoleClick(): void {
    let gameConsoleConfiguration = this.gameConsoleConfiguration();
    if (gameConsoleConfiguration == null) {
      this.#snackBar.open('Invalid console configuration.', '', {
        duration: 3000,
      });
      return;
    }
    this.#dialogService
      .openDeleteConsoleDialog(gameConsoleConfiguration)
      .subscribe((result) => {
        if (result) {
          this.#router.navigate(['/']);
        }
      });
  }

  onEditConsoleClick(): void {
    let gameConsoleConfiguration = this.gameConsoleConfiguration();
    if (gameConsoleConfiguration == null) {
      this.#snackBar.open('Invalid console configuration.', '', {
        duration: 3000,
      });
      return;
    }
    this.#dialogService
      .openUpdateConsoleDialog(gameConsoleConfiguration)
      .subscribe((result) => {
        if (result) {
          this.gameConsoleConfiguration.update(() => result);
        }
      });
  }
}
