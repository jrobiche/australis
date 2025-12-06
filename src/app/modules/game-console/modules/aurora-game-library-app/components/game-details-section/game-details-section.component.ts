import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

import {
  AuroraAssetType,
  AuroraGameData,
} from '@app/modules/aurora/types/aurora';
import { AuroraStateService } from '@app/modules/aurora/services/aurora-state.service';
import { BreakpointService } from '@app/shared/services/breakpoint.service';
import { GameConsoleConfiguration } from '@app/shared/types/app';
import { GameCardComponent } from '../game-card/game-card.component';
// import { UiService } from '@app/shared/services/ui.service';

@Component({
  selector: 'app-game-details-section',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    RouterModule,
    GameCardComponent,
  ],
  templateUrl: './game-details-section.component.html',
  styleUrl: './game-details-section.component.sass',
})
export class GameDetailsSectionComponent implements OnChanges, OnInit {
  readonly #auroraState = inject(AuroraStateService);
  readonly #snackBar = inject(MatSnackBar);
  readonly breakpoint = inject(BreakpointService);
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
      return `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${this.assetBackgroundUrl}')`;
    }
    return `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))`;
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
