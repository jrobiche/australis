import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

import {
  AuroraAssetType,
  AuroraGameData,
} from '@app/modules/aurora/types/aurora';
import { AuroraStateService } from '@app/modules/aurora/services/aurora-state.service';
import { GameConsoleConfiguration } from '@app/shared/types/app';
import { GameBoxartCardComponent } from '../game-boxart-card/game-boxart-card.component';
import { GameDetailsCardComponent } from '../game-details-card/game-details-card.component';

@Component({
  selector: 'app-game-details-section',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    RouterModule,
    GameBoxartCardComponent,
    GameDetailsCardComponent,
  ],
  templateUrl: './game-details-section.component.html',
  styleUrl: './game-details-section.component.sass',
})
export class GameDetailsSectionComponent implements OnChanges, OnInit {
  readonly #auroraState = inject(AuroraStateService);
  readonly #snackBar = inject(MatSnackBar);
  @Input({ required: true })
  gameConsoleConfiguration!: GameConsoleConfiguration;
  @Input({ required: true })
  gameData!: AuroraGameData;
  assetBackgroundUrl: string | null;
  assetIconUrl: string | null;

  constructor() {
    this.assetBackgroundUrl = null;
    this.assetIconUrl = null;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (Object.hasOwn(changes, 'gameData')) {
      let currentGameId = this.gameData.id;
      this.assetBackgroundUrl = null;
      this.assetIconUrl = null;
      this.#auroraState.game
        .assetImageUrl(
          this.gameConsoleConfiguration,
          this.gameData,
          AuroraAssetType.Background,
        )
        .then((imageUrl) => {
          // if a user selects multiple different games before the background has loaded,
          // only display the background of the latest game the user selected
          if (this.gameData.id == currentGameId) {
            this.assetBackgroundUrl = imageUrl;
          }
        });
      this.#auroraState.game
        .assetImageUrl(
          this.gameConsoleConfiguration,
          this.gameData,
          AuroraAssetType.Icon,
        )
        .then((imageUrl) => {
          // if a user selects multiple different games before the icon has loaded,
          // only display the icon of the latest game the user selected
          if (this.gameData.id == currentGameId) {
            this.assetIconUrl = imageUrl;
          }
        });
    }
  }

  ngOnInit() {
    this.#auroraState.game
      .assetImageUrl(
        this.gameConsoleConfiguration,
        this.gameData,
        AuroraAssetType.Background,
      )
      .then((imageUrl) => {
        this.assetBackgroundUrl = imageUrl;
      });
    this.#auroraState.game
      .assetImageUrl(
        this.gameConsoleConfiguration,
        this.gameData,
        AuroraAssetType.Icon,
      )
      .then((imageUrl) => {
        this.assetIconUrl = imageUrl;
      });
  }

  get backgroundImageStyle(): string | null {
    if (this.assetBackgroundUrl) {
      return `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('${this.assetBackgroundUrl}')`;
    }
    return `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))`;
  }

  get editGameAssetsRouterLink(): string[] {
    return [`${this.gameData.id}`, 'assets'];
  }

  get titleText(): string {
    return this.gameData?.titleName ?? 'Unknown';
  }

  async onLaunchGameClick() {
    try {
      await this.#auroraState.login(this.gameConsoleConfiguration);
      await this.#auroraState.launchGame(
        this.gameConsoleConfiguration,
        this.gameData,
      );
    } catch (error) {
      console.error('Failed to launch game. Got the following error:', error);
      this.#snackBar.open('Failed to launch game.', '', {
        duration: 3000,
      });
    }
  }
}
