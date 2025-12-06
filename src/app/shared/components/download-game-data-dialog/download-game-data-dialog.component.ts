import { Component, OnDestroy, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';

import { AuroraStateService } from '@app/modules/aurora/services/aurora-state.service';
import { GameConsoleConfiguration } from '@app/shared/types/app';

@Component({
  selector: 'app-download-game-data-dialog',
  imports: [MatButtonModule, MatDialogModule, MatIconModule, MatStepperModule],
  templateUrl: './download-game-data-dialog.component.html',
  styleUrl: './download-game-data-dialog.component.sass',
})
export class DownloadGameDataDialogComponent implements OnDestroy {
  readonly #auroraState = inject(AuroraStateService);
  readonly #dialogRef = inject(MatDialogRef<DownloadGameDataDialogComponent>);
  readonly #snackBar = inject(MatSnackBar);
  readonly gameConsoleConfiguration =
    inject<GameConsoleConfiguration>(MAT_DIALOG_DATA);
  cancelDownload: boolean;
  downloadDatabasesStatusText: string;
  downloadGameDataStatusText: string;
  isDownloadDatabasesCompleted: boolean;
  isDownloadGameDataCompleted: boolean;
  isDownloadInProgress: boolean;

  constructor() {
    this.cancelDownload = false;
    this.downloadDatabasesStatusText = '';
    this.downloadGameDataStatusText = '';
    this.isDownloadDatabasesCompleted = false;
    this.isDownloadGameDataCompleted = false;
    this.isDownloadInProgress = false;
  }

  ngOnDestroy() {
    this.cancelDownload = true;
  }

  get isDownloadDatabasesDisabled(): boolean {
    return this.isDownloadInProgress;
  }

  get isDownloadGameDataDisabled(): boolean {
    return this.isDownloadInProgress;
  }

  onCancelClick(): void {
    this.cancelDownload = true;
    this.#dialogRef.close(
      this.isDownloadDatabasesCompleted || this.isDownloadGameDataCompleted,
    );
  }

  onCloseClick(): void {
    this.cancelDownload = true;
    this.#dialogRef.close(
      this.isDownloadDatabasesCompleted || this.isDownloadGameDataCompleted,
    );
  }

  async onDownloadDatabasesClick() {
    this.isDownloadInProgress = true;
    try {
      this.downloadDatabasesStatusText =
        'Download Progress: Downloading databases...';
      await this.#auroraState.ftp.downloadAuroraDatabases(
        this.gameConsoleConfiguration,
      );
      this.downloadDatabasesStatusText =
        'Download Progress: Successfully downloaded databases';
      this.isDownloadDatabasesCompleted = true;
    } catch (error) {
      console.error(
        'Failed to download databases. Got the following error:',
        error,
      );
      this.downloadDatabasesStatusText =
        'Download Progress: Failed to download databases';
      this.#snackBar.open('Failed to download databases.', '', {
        duration: 3000,
      });
    }
    this.isDownloadInProgress = false;
  }

  async onDownloadGameDataClick() {
    this.isDownloadInProgress = true;
    try {
      let dirs = await this.#auroraState.ftp.listAuroraGameDataDirectories(
        this.gameConsoleConfiguration,
      );
      this.downloadGameDataStatusText = `Download Progress: 0/${dirs.length}`;
      for (let i = 0; i < dirs.length; i += 1) {
        if (this.cancelDownload) {
          break;
        }
        await this.#auroraState.ftp.downloadAuroraGameDataDirectory(
          this.gameConsoleConfiguration,
          dirs[i],
        );
        this.downloadGameDataStatusText = `Download Progress: ${i + 1}/${dirs.length}`;
      }
      this.downloadGameDataStatusText =
        'Download Progress: Successfully downloaded game data';
      this.isDownloadGameDataCompleted = true;
    } catch (error) {
      console.error(
        'Failed to download game data. Got the following error:',
        error,
      );
      this.downloadGameDataStatusText =
        'Download Progress: Failed to download game data';
      this.#snackBar.open('Failed to download game data.', '', {
        duration: 3000,
      });
    }
    this.isDownloadInProgress = false;
  }

  onLaunchAuroraClick() {
    this.#auroraState
      .login(this.gameConsoleConfiguration)
      .then(() => {
        return this.#auroraState.launchLauncher(this.gameConsoleConfiguration);
      })
      .catch((error) => {
        console.error(
          'Failed to launch launcher. Got the following error:',
          error,
        );
        this.#snackBar.open('Failed to launch Aurora.', '', {
          duration: 3000,
        });
      });
  }
}
