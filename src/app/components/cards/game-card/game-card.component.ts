import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Signal,
  SimpleChanges,
  inject,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuroraAssetType, AuroraGameData } from '@app/types/aurora';
import { AuroraGameService } from '@app/services/aurora-game.service';
import { GameBoxartSceneComponent } from '@app/components/scenes/game-boxart-scene/game-boxart-scene.component';
import { GameConsoleConfiguration } from '@app/types/app';
import { UiService } from '@app/services/ui.service';

@Component({
  selector: 'app-game-card',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatIconModule,
    MatListModule,
    GameBoxartSceneComponent,
  ],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.sass',
})
export class GameCardComponent implements OnChanges, OnInit {
  readonly #auroraGameService = inject(AuroraGameService);
  readonly #snackBar = inject(MatSnackBar);
  readonly uiService = inject(UiService);
  readonly accordionRef: Signal<MatAccordion> =
    viewChild.required(MatAccordion);
  @Input({ required: true })
  gameConsoleConfiguration!: GameConsoleConfiguration;
  @Input({ required: true })
  gameData!: AuroraGameData;
  assetBoxartUrl: string | null;
  assetScreenshotUrls: (string | null)[];
  autoRotateBoxart: boolean;

  constructor() {
    this.assetBoxartUrl = null;
    this.assetScreenshotUrls = [];
    this.autoRotateBoxart = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (Object.hasOwn(changes, 'gameData')) {
      let currentGameId = this.gameData.id;
      this.accordionRef().closeAll();
      this.assetBoxartUrl = null;
      this.assetScreenshotUrls = [];
      this.#auroraGameService
        .assetImageUrl(
          this.gameConsoleConfiguration,
          this.gameData,
          AuroraAssetType.Boxart,
        )
        .then((imageUrl) => {
          // if a user selects multiple different games before the boxart has loaded,
          // only display the boxart of the latest game the user selected
          if (this.gameData.id == currentGameId) {
            this.assetBoxartUrl = imageUrl;
          }
        });
    }
  }

  ngOnInit() {
    let currentGameId = this.gameData.id;
    this.#auroraGameService
      .assetImageUrl(
        this.gameConsoleConfiguration,
        this.gameData,
        AuroraAssetType.Boxart,
      )
      .then((imageUrl) => {
        if (this.gameData.id == currentGameId) {
          this.assetBoxartUrl = imageUrl;
        }
      });
  }

  get descriptionText(): string {
    if (this.gameData.description) {
      return this.gameData.description;
    }
    return 'No description available.';
  }

  get developerText(): string {
    if (this.gameData.developer) {
      return this.gameData.developer;
    }
    return 'Unknown';
  }

  get hasScreenshots(): boolean {
    return this.assetScreenshotUrls.findIndex((x) => x != null) != -1;
  }

  get mediaIdText(): string {
    if (this.gameData.mediaId || this.gameData.mediaId == 0) {
      return this.gameData.mediaId.toString(16).padStart(8, '0').toUpperCase();
    }
    return 'Unknown';
  }

  get publisherText(): string {
    if (this.gameData.publisher) {
      return this.gameData.publisher;
    }
    return 'Unknown';
  }

  get releaseDateText(): string {
    if (this.gameData.releaseDate) {
      return this.gameData.releaseDate;
    }
    return 'Unknown';
  }

  get rotateBoxartIcon(): string {
    return this.autoRotateBoxart ? 'pause' : 'play_arrow';
  }

  get titleIdText(): string {
    if (this.gameData.titleId || this.gameData.titleId == 0) {
      return this.gameData?.titleId.toString(16).padStart(8, '0').toUpperCase();
    }
    return 'Unknown';
  }

  onScreenshotsAccordianOpened(): void {
    let currentGameId = this.gameData.id;
    for (let i = 0; i < 20; i++) {
      this.#auroraGameService
        .screenshotAssetImageUrl(
          this.gameConsoleConfiguration,
          this.gameData,
          i,
        )
        .then((imageUrl) => {
          if (this.gameData.id == currentGameId) {
            this.assetScreenshotUrls[i] = imageUrl;
          }
        })
        .catch((error) => {
          console.error(
            `Failed to load screenshot ${i + 1} asset image. Got the following error:`,
            error,
          );
          this.#snackBar.open(
            `Failed to load screenshot ${i + 1} asset image`,
            '',
            {
              duration: 3000,
            },
          );
        });
    }
  }

  onToggleBoxartRotationClick() {
    this.autoRotateBoxart = !this.autoRotateBoxart;
  }
}
