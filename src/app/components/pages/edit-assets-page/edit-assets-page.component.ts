import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuroraAssetType, AuroraGameData } from '@app/types/aurora';
import { AuroraGameService } from '@app/services/aurora-game.service';
import { EditAssetCardComponent } from '@app/components/cards/edit-asset-card/edit-asset-card.component';
import { GameConsoleConfiguration } from '@app/types/app';
import { GameConsoleConfigurationService } from '@app/services/game-console-configuration.service';
import { PageToolbarComponent } from '@app/components/toolbars/page-toolbar/page-toolbar.component';
import { UiService } from '@app/services/ui.service';

@Component({
  selector: 'app-edit-assets-page',
  imports: [
    AsyncPipe,
    EditAssetCardComponent,
    MatButtonModule,
    MatIconModule,
    PageToolbarComponent,
  ],
  templateUrl: './edit-assets-page.component.html',
  styleUrl: './edit-assets-page.component.sass',
})
export class EditAssetsPageComponent implements OnInit {
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #auroraGameService = inject(AuroraGameService);
  readonly #gameConsoleConfigurationService = inject(
    GameConsoleConfigurationService,
  );
  readonly #snackBar = inject(MatSnackBar);
  readonly uiService = inject(UiService);
  assetTypes: AuroraAssetType[];
  gameConsoleConfiguration: GameConsoleConfiguration | null;
  gameData: AuroraGameData | null;

  constructor() {
    this.assetTypes = [
      AuroraAssetType.Icon,
      AuroraAssetType.Banner,
      AuroraAssetType.Boxart,
      // AuroraAssetType.Slot,
      AuroraAssetType.Background,
      AuroraAssetType.Screenshot1,
      AuroraAssetType.Screenshot2,
      AuroraAssetType.Screenshot3,
      AuroraAssetType.Screenshot4,
      AuroraAssetType.Screenshot5,
      AuroraAssetType.Screenshot6,
      AuroraAssetType.Screenshot7,
      AuroraAssetType.Screenshot8,
      AuroraAssetType.Screenshot9,
      AuroraAssetType.Screenshot10,
      AuroraAssetType.Screenshot11,
      AuroraAssetType.Screenshot12,
      AuroraAssetType.Screenshot13,
      AuroraAssetType.Screenshot14,
      AuroraAssetType.Screenshot15,
      AuroraAssetType.Screenshot16,
      AuroraAssetType.Screenshot17,
      AuroraAssetType.Screenshot18,
      AuroraAssetType.Screenshot19,
      AuroraAssetType.Screenshot20,
    ];
    this.gameConsoleConfiguration = null;
    this.gameData = null;
  }

  async ngOnInit() {
    // load console configuration
    if (this.consoleConfigurationId == null) {
      this.#snackBar.open('Invalid game console configuration ID.', '', {
        duration: 3000,
      });
      return;
    }
    try {
      this.gameConsoleConfiguration =
        await this.#gameConsoleConfigurationService.read(
          this.consoleConfigurationId,
        );
    } catch (error) {
      console.error(
        `Failed to load game console configuration with id '${this.consoleConfigurationId}'. Got the following error:`,
        error,
      );
      this.#snackBar.open('Failed to load game console configuration.', '', {
        duration: 3000,
      });
      return;
    }

    // load game data
    if (this.gameId == null) {
      this.#snackBar.open('Invalid game console configuration ID.', '', {
        duration: 3000,
      });
      return;
    }
    try {
      this.gameData = await this.#auroraGameService.gameData(
        this.gameConsoleConfiguration,
        this.gameId,
      );
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

  get gameId(): number | null {
    if (this.#activatedRoute.snapshot.params['gameId']) {
      return parseInt(this.#activatedRoute.snapshot.params['gameId']);
    }
    return null;
  }

  onUploadAssetsClick(): void {
    if (this.gameData == null) {
      this.#snackBar.open('Invalid game data.', '', {
        duration: 3000,
      });
      return;
    }
    if (this.gameConsoleConfiguration == null) {
      this.#snackBar.open('Invalid game console configuration.', '', {
        duration: 3000,
      });
      return;
    }
    this.uiService.openUploadAssetsDialog({
      gameConsoleConfiguration: this.gameConsoleConfiguration,
      gameData: this.gameData,
    });
  }
}
