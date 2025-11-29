import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

import { PageTitleToolbarComponent } from '@app/shared/components/page-title-toolbar/page-title-toolbar.component';
import { PageToolbarComponent } from '@app/shared/components/page-toolbar/page-toolbar.component';
import { BreakpointService } from '@app/shared/services/breakpoint.service';
import { DialogService } from '@app/shared/services/dialog.service';
import { GameConsoleConfigurationStoreService } from '@app/shared/services/game-console-configuration-store.service';
import { GameConsoleConfiguration } from '@app/shared/types/app';
import { ConsoleNavigationListComponent } from '../console-navigation-list/console-navigation-list.component';

@Component({
  selector: 'app-home-page',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    ConsoleNavigationListComponent,
    PageTitleToolbarComponent,
    PageToolbarComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.sass',
})
export class HomePageComponent {
  readonly #dialogService = inject(DialogService);
  readonly #gameConsoleConfigurationStore = inject(
    GameConsoleConfigurationStoreService,
  );
  readonly #snackBar = inject(MatSnackBar);
  readonly breakpoint = inject(BreakpointService);

  gameConsoleConfigurations: GameConsoleConfiguration[];

  constructor() {
    this.gameConsoleConfigurations = [];
  }

  ngOnInit() {
    this.#loadGameConsoleConfigurations();
  }

  onAddConsoleClick(): void {
    this.#dialogService
      .openCreateConsoleDialog()
      .subscribe((newConfiguration) => {
        if (newConfiguration) {
          this.#loadGameConsoleConfigurations();
        }
      });
  }

  #loadGameConsoleConfigurations(): void {
    this.#gameConsoleConfigurationStore
      .readAllSorted()
      .then((configs) => {
        this.gameConsoleConfigurations = configs;
      })
      .catch((error) => {
        this.gameConsoleConfigurations = [];
        console.error(
          'Failed to load game console configurations. Got the following error:',
          error,
        );
        this.#snackBar.open('Failed to load game console configurations.', '', {
          duration: 3000,
        });
      });
  }
}
