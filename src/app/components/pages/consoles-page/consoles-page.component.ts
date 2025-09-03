import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

import { GameConsoleConfiguration } from '@app/types/app';
import { GameConsoleConfigurationService } from '@app/services/game-console-configuration.service';
import { PageToolbarComponent } from '@app/components/toolbars/page-toolbar/page-toolbar.component';
import { UiService } from '@app/services/ui.service';

@Component({
  selector: 'app-consoles-page',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    RouterModule,
    PageToolbarComponent,
  ],
  templateUrl: './consoles-page.component.html',
  styleUrl: './consoles-page.component.sass',
})
export class ConsolesPageComponent implements OnInit {
  readonly #gameConsoleConfigurationService = inject(
    GameConsoleConfigurationService,
  );
  readonly #snackBar = inject(MatSnackBar);
  readonly uiService = inject(UiService);
  gameConsoleConfigurations: GameConsoleConfiguration[];

  constructor() {
    this.gameConsoleConfigurations = [];
  }

  ngOnInit() {
    this.#loadGameConsoleConfigurations();
  }

  onAddConsoleClick() {
    this.uiService.openCreateConsoleDialog().subscribe((result) => {
      if (result) {
        this.#loadGameConsoleConfigurations();
      }
    });
  }

  #loadGameConsoleConfigurations(): void {
    this.#gameConsoleConfigurationService
      .readAll()
      .then((configs) => {
        this.gameConsoleConfigurations = configs.sort(
          this.uiService.compareGameConsoleConfigurations,
        );
      })
      .catch((error) => {
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
