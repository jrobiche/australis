import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';

import {
  AuroraAssetType,
  AuroraGameData,
} from '@app/modules/aurora/types/aurora';
import { AuroraStateService } from '@app/modules/aurora/services/aurora-state.service';
import { GameConsoleConfiguration } from '@app/shared/types/app';
import { GameBoxartSceneComponent } from '../game-boxart-scene/game-boxart-scene.component';

@Component({
  selector: 'app-game-boxart-card',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    GameBoxartSceneComponent,
  ],
  templateUrl: './game-boxart-card.component.html',
  styleUrl: './game-boxart-card.component.sass',
})
export class GameBoxartCardComponent implements OnChanges, OnInit {
  readonly #auroraState = inject(AuroraStateService);
  @Input({ required: true })
  gameConsoleConfiguration!: GameConsoleConfiguration;
  @Input({ required: true })
  gameData!: AuroraGameData;
  assetBoxartUrl: string | null;
  isBoxartAutoRotate: boolean;
  isBoxartInteractive: boolean;

  constructor() {
    this.assetBoxartUrl = null;
    this.isBoxartAutoRotate = false;
    this.isBoxartInteractive = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (Object.hasOwn(changes, 'gameData')) {
      let currentGameId = this.gameData.id;
      this.assetBoxartUrl = null;
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

  onBoxartSettingsAutoRotateClick(event: any): void {
    this.isBoxartAutoRotate = !this.isBoxartAutoRotate;
  }

  onBoxartSettingsInteractiveClick(event: any): void {
    this.isBoxartInteractive = !this.isBoxartInteractive;
  }
}
