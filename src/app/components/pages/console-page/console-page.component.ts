import { AsyncPipe } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTab, MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';

import { GameConsoleConfiguration } from '@app/types/app';
import { GameConsoleConfigurationService } from '@app/services/game-console-configuration.service';
import { GameLibraryComponent } from './game-library/game-library.component';
import { PageToolbarComponent } from '@app/components/toolbars/page-toolbar/page-toolbar.component';
import { SystemDetailsComponent } from './system-details/system-details.component';
import { UiService } from '@app/services/ui.service';

// TODO clean up logic
@Component({
  selector: 'app-console-page',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTabsModule,
    GameLibraryComponent,
    PageToolbarComponent,
    SystemDetailsComponent,
  ],
  templateUrl: './console-page.component.html',
  styleUrl: './console-page.component.sass',
})
export class ConsolePageComponent implements OnInit {
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #gameConsoleConfigurationService = inject(
    GameConsoleConfigurationService,
  );
  readonly #location = inject(Location);
  readonly #router = inject(Router);
  readonly #snackBar = inject(MatSnackBar);
  readonly uiService = inject(UiService);
  // TODO navigation/routing
  // @ViewChild('gamesTab') gamesTab: MatTab | null;
  // @ViewChild('systemTab') systemTab: MatTab | null;
  gameId: number | null;
  gameConsoleConfiguration: GameConsoleConfiguration | null;

  constructor() {
    // this.gamesTab = null;
    // this.systemTab = null;
    this.gameId = null;
    this.gameConsoleConfiguration = null;
  }

  async ngOnInit() {
    let consoleConfigurationId = this.consoleConfigurationId;
    if (consoleConfigurationId == null) {
      this.#snackBar.open('Invalid game console configuration ID.', '', {
        duration: 3000,
      });
      return;
    }

    // load game console configuration
    try {
      this.gameConsoleConfiguration =
        await this.#gameConsoleConfigurationService.read(
          consoleConfigurationId,
        );
    } catch (error) {
      console.error(
        `Failed to load game console configuration with id '${consoleConfigurationId}'. Got the following error:`,
        error,
      );
      this.#snackBar.open('Failed to load game console configuration.', '', {
        duration: 3000,
      });
      return;
    }

    // TODO this is not actually loading game data...
    // load game data
    try {
      const gameLibraryGameId: string | null =
        this.#activatedRoute.snapshot.queryParamMap.get('gameLibraryGameId');
      console.log('Game Library Game ID:', gameLibraryGameId);
      if (this.#activatedRoute.snapshot.params['gameId']) {
        this.gameId =
          parseInt(this.#activatedRoute.snapshot.params['gameId']) ?? null;
      }
    } catch (error) {
      console.error(
        `Failed to load game data with id '${this.gameId}'. Got the following error:`,
        error,
      );
      this.#snackBar.open('Failed to load game data.', '', {
        duration: 3000,
      });
      return;
    }
  }

  get consoleConfigurationId(): string | null {
    return this.#activatedRoute.snapshot.params['consoleId'] ?? null;
  }

  get isDeleteConsoleDisabled(): boolean {
    return this.gameConsoleConfiguration == null;
  }

  get isEditConsoleDisabled(): boolean {
    return this.gameConsoleConfiguration == null;
  }

  get pageToolbarHeading(): string {
    return this.gameConsoleConfiguration?.name ?? 'Unknown';
  }

  onDeleteConsoleClick(): void {
    if (this.gameConsoleConfiguration == null) {
      this.#snackBar.open('Invalid console configuration.', '', {
        duration: 3000,
      });
      return;
    }
    // TODO use confirmationDialog instead of delete console dialog?
    this.uiService
      .openDeleteConsoleDialog(this.gameConsoleConfiguration)
      .subscribe((result) => {
        if (result) {
          this.#router.navigate(['/']);
        }
      });
  }

  onEditConsoleClick(): void {
    if (this.gameConsoleConfiguration == null) {
      this.#snackBar.open('Invalid console configuration', '', {
        duration: 3000,
      });
      return;
    }
    this.uiService
      .openUpdateConsoleDialog(this.gameConsoleConfiguration)
      .subscribe((result) => {
        if (result) {
          this.#gameConsoleConfigurationService
            .read(result.id)
            .then((configuration: GameConsoleConfiguration) => {
              this.gameConsoleConfiguration = configuration;
            })
            .catch((error) => {
              console.error(
                'Failed to update console configuration. Got the following error:',
                error,
              );
              this.#snackBar.open(
                'Failed to update console configuration.',
                '',
                {
                  duration: 3000,
                },
              );
            });
        }
      });
  }

  // TODO use query param
  onGameIdChange(gameId: number | null): void {
    let configurationId = this.gameConsoleConfiguration?.id ?? '';
    this.gameId = gameId;
    this.#location.replaceState(`/consoles/${configurationId}/games/${gameId}`);
  }
}
