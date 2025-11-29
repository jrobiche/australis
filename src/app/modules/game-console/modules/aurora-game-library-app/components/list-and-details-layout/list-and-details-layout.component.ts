import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AuroraGameData } from '@app/modules/aurora/types/aurora';
import { AuroraStateService } from '@app/modules/aurora/services/aurora-state.service';
import { BreakpointService } from '@app/shared/services/breakpoint.service';
import { DialogService } from '@app/shared/services/dialog.service';
import { GameConsoleConfiguration } from '@app/shared/types/app';
import { GameListEntry } from '@app/shared/types/app';
import { GameDetailsSectionComponent } from '../game-details-section/game-details-section.component';

@Component({
  selector: 'app-list-and-details-layout',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    GameDetailsSectionComponent,
  ],
  templateUrl: './list-and-details-layout.component.html',
  styleUrl: './list-and-details-layout.component.sass',
})
export class ListAndDetailsLayoutComponent implements OnInit {
  readonly #auroraState = inject(AuroraStateService);
  readonly #dialogService = inject(DialogService);
  readonly #snackBar = inject(MatSnackBar);
  readonly breakpointService = inject(BreakpointService);
  @Input({ required: true })
  gameConsoleConfiguration!: GameConsoleConfiguration;
  @ViewChild('drawer')
  drawer: MatDrawer | null;
  selectedGameData: AuroraGameData | null;
  // TODO
  // @Input()
  // gameId: number | null;
  gameList: GameListEntry[];

  constructor() {
    this.drawer = null;
    this.selectedGameData = null;
    this.gameList = [];
  }

  ngOnInit() {
    this.#auroraState.game
      .list(this.gameConsoleConfiguration)
      .then((gameList) => {
        this.gameList = gameList.sort(this.#compareGameListEntries);
        if (this.gameList.length > 0) {
          this.#updateSelectedGame(this.gameList[0].id);
        }
      })
      .catch((error) => {
        console.error(
          'Failed to load game list. Got the following error:',
          error,
        );
        this.#snackBar.open('Failed to load game list', '', {
          duration: 3000,
        });
      })
      .finally(() => {
        if (this.breakpointService.isWeb) {
          setTimeout(() => {
            this.drawer?.open();
          }, 250);
        }
      });
  }

  gameListCompareWith(o1: GameListEntry, o2: GameListEntry): boolean {
    return o1.id == o2.id;
  }

  isSelectedGameId(gameId: number): boolean {
    return this.selectedGameData?.id == gameId;
  }

  onDownloadGameDataClick() {
    this.#dialogService
      .openDownloadGameDataDialog(this.gameConsoleConfiguration)
      .subscribe((result) => {
        if (result) {
          this.#auroraState.game
            .list(this.gameConsoleConfiguration)
            .then((gameList) => {
              this.gameList = gameList.sort(this.#compareGameListEntries);
              if (this.selectedGameData == null && this.gameList.length > 0) {
                this.#updateSelectedGame(this.gameList[0].id);
              }
            })
            .catch((error) => {
              console.error(
                'Failed to load game list. Got the following error:',
                error,
              );
              this.#snackBar.open('Failed to load game list', '', {
                duration: 3000,
              });
            });
        }
      });
  }

  onGameSelectionChange(event: any) {
    this.#updateSelectedGame(event.options[0].value.id);
    if (this.drawer && !this.breakpointService.isWeb) {
      this.drawer.close();
    }
  }

  // TODO move somewhere else
  #compareGameListEntries(a: GameListEntry, b: GameListEntry) {
    // compare title names
    const nameA = a.titleName.toUpperCase();
    const nameB = b.titleName.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names are the same, compare ids
    const idA = a.id;
    const idB = b.id;
    if (idA < idB) {
      return -1;
    }
    if (idA > idB) {
      return 1;
    }
    return 0;
  }

  #updateSelectedGame(gameId: number | null) {
    if (gameId == null) {
      this.selectedGameData = null;
      return;
    }
    this.#auroraState.game
      .gameData(this.gameConsoleConfiguration, gameId)
      .then((gameData) => {
        this.selectedGameData = gameData;
      })
      .catch((error) => {
        this.selectedGameData = null;
        console.error(
          'Failed to load game data. Got the following error:',
          error,
        );
        this.#snackBar.open('Failed to load game data.', '', {
          duration: 3000,
        });
      });
  }
}
