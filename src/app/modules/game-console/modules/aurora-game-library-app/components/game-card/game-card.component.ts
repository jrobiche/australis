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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  AuroraAssetType,
  AuroraGameData,
} from '@app/modules/aurora/types/aurora';
import { AuroraStateService } from '@app/modules/aurora/services/aurora-state.service';
import { BreakpointService } from '@app/shared/services/breakpoint.service';
import { GameConsoleConfiguration } from '@app/shared/types/app';
import { GameBoxartSceneComponent } from '../game-boxart-scene/game-boxart-scene.component';

@Component({
  selector: 'app-game-card',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDividerModule,
    MatExpansionModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    GameBoxartSceneComponent,
  ],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.sass',
})
export class GameCardComponent implements OnChanges, OnInit {
  readonly #auroraState = inject(AuroraStateService);
  readonly #snackBar = inject(MatSnackBar);
  readonly breakpoint = inject(BreakpointService);
  readonly accordionRef: Signal<MatAccordion> =
    viewChild.required(MatAccordion);
  @Input({ required: true })
  gameConsoleConfiguration!: GameConsoleConfiguration;
  @Input({ required: true })
  gameData!: AuroraGameData;
  assetBoxartUrl: string | null;
  assetScreenshotUrls: (string | null)[];
  isBoxartAutoRotate: boolean;
  isBoxartInteractive: boolean;

  constructor() {
    this.assetBoxartUrl = null;
    this.assetScreenshotUrls = [];
    this.isBoxartAutoRotate = false;
    this.isBoxartInteractive = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (Object.hasOwn(changes, 'gameData')) {
      let currentGameId = this.gameData.id;
      this.accordionRef().closeAll();
      this.assetBoxartUrl = null;
      this.assetScreenshotUrls = [];
      this.#auroraState.game
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
    this.#auroraState.game
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

  get titleIdText(): string {
    if (this.gameData.titleId || this.gameData.titleId == 0) {
      return this.gameData?.titleId.toString(16).padStart(8, '0').toUpperCase();
    }
    return 'Unknown';
  }

  onScreenshotsAccordianOpened(): void {
    let currentGameId = this.gameData.id;
    for (let i = 0; i < 20; i++) {
      this.#auroraState.game
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
            `Failed to load screenshot ${i + 1} asset image.`,
            '',
            {
              duration: 3000,
            },
          );
        });
    }
  }

  onBoxartSettingsAutoRotateClick(event: any): void {
    this.isBoxartAutoRotate = !this.isBoxartAutoRotate;
  }

  onBoxartSettingsInteractiveClick(event: any): void {
    this.isBoxartInteractive = !this.isBoxartInteractive;
  }
}
