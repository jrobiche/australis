import { AsyncPipe } from '@angular/common';
import { Component, OnInit, Signal, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute } from '@angular/router';
import { ROUTER_OUTLET_DATA } from '@angular/router';

import { AuroraStateService } from '@app/modules/aurora/services/aurora-state.service';
import {
  AuroraAssetType,
  AuroraGameData,
} from '@app/modules/aurora/types/aurora';
import { PageTitleToolbarComponent } from '@app/shared/components/page-title-toolbar/page-title-toolbar.component';
import { ResponsiveWidthContainerComponent } from '@app/shared/components/responsive-width-container/responsive-width-container.component';
import { BreakpointService } from '@app/shared/services/breakpoint.service';
import { DialogService } from '@app/shared/services/dialog.service';
import { GameConsoleConfiguration, GameListEntry } from '@app/shared/types/app';
import { EditAssetCardComponent } from './components/edit-asset-card/edit-asset-card.component';

@Component({
  selector: 'app-aurora-asset-manager-app',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    EditAssetCardComponent,
    PageTitleToolbarComponent,
    ResponsiveWidthContainerComponent,
  ],
  templateUrl: './aurora-asset-manager-app.component.html',
  styleUrl: './aurora-asset-manager-app.component.sass',
})
export class AuroraAssetManagerAppComponent implements OnInit {
  readonly #activatedRoute = inject(ActivatedRoute);
  readonly #auroraState = inject(AuroraStateService);
  readonly #dialogService = inject(DialogService);
  readonly #snackBar = inject(MatSnackBar);
  readonly breakpoint = inject(BreakpointService);
  readonly gameConsoleConfiguration = inject(
    ROUTER_OUTLET_DATA,
  ) as Signal<GameConsoleConfiguration>;
  @ViewChild('drawer')
  drawer: MatDrawer | null;
  assetTypes: AuroraAssetType[];
  gameData: AuroraGameData | null;
  gameList: GameListEntry[];

  constructor() {
    this.drawer = null;
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
    this.gameList = [];
    this.gameData = null;
  }

  async ngOnInit() {
    if (this.#activatedRoute.snapshot.params['gameId']) {
      this.gameData = await this.#loadGameData(
        parseInt(this.#activatedRoute.snapshot.params['gameId']) || null,
      );
    }
    this.gameList = await this.#loadGameList();
    if (this.gameData == null && this.gameList.length > 0) {
      this.#updateSelectedGame(this.gameList[0].id);
    }
    if (this.breakpoint.isWeb) {
      setTimeout(() => {
        this.drawer?.open();
      }, 250);
    }
  }

  get titleText(): string {
    return this.gameData?.titleName ?? 'No Game Selected';
  }

  isSelectedGameId(gameId: number): boolean {
    return this.gameData?.id == gameId;
  }

  // TODO is this needed?
  gameListCompareWith(o1: GameListEntry, o2: GameListEntry): boolean {
    return o1.id == o2.id;
  }

  onDownloadGameDataClick() {
    let gameConsoleConfiguration = this.gameConsoleConfiguration();
    this.#dialogService
      .openDownloadGameDataDialog(gameConsoleConfiguration)
      .subscribe((result) => {
        if (result) {
          this.#loadGameList().then((gameList) => {
            this.gameList = gameList;
            if (this.gameData == null && this.gameList.length > 0) {
              this.#updateSelectedGame(this.gameList[0].id);
            }
          });
        }
      });
  }

  onGameSelectionChange(event: any) {
    this.#updateSelectedGame(event.options[0].value.id);
    if (this.drawer && !this.breakpoint.isWeb) {
      this.drawer.close();
    }
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
    this.#dialogService.openUploadAssetsDialog({
      gameConsoleConfiguration: this.gameConsoleConfiguration(),
      gameData: this.gameData,
    });
  }

  #loadGameData(gameId: number | null): Promise<AuroraGameData | null> {
    if (gameId === null) {
      return Promise.resolve(null);
    }
    return this.#auroraState.game
      .gameData(this.gameConsoleConfiguration(), gameId)
      .then((gameData) => {
        return gameData;
      })
      .catch((error) => {
        console.error(
          'Failed to load game data. Got the following error:',
          error,
        );
        this.#snackBar.open('Failed to load game data.', 'Close');
        return Promise.reject(error);
      });
  }

  #loadGameList(): Promise<GameListEntry[]> {
    return this.#auroraState.game
      .listSorted(this.gameConsoleConfiguration())
      .catch((error) => {
        console.error(
          'Failed to load game list. Got the following error:',
          error,
        );
        this.#snackBar.open('Failed to load game list', '', {
          duration: 3000,
        });
        return Promise.resolve([]);
      });
  }

  #updateSelectedGame(gameId: number | null) {
    this.#loadGameData(gameId)
      .then((gameData) => {
        this.gameData = gameData;
      })
      .catch((_) => {
        this.gameData = null;
      });
  }
}
