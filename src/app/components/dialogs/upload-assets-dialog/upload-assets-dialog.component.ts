import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';

import { AuroraFtpService } from '@app/services/aurora-ftp.service';
import { AuroraHttpService } from '@app/services/aurora-http.service';
import { UploadAssetsDialogData } from '@app/types/app';

@Component({
  selector: 'app-upload-assets-dialog',
  imports: [MatButtonModule, MatDialogModule, MatIconModule, MatStepperModule],
  templateUrl: './upload-assets-dialog.component.html',
  styleUrl: './upload-assets-dialog.component.sass',
})
export class UploadAssetsDialogComponent {
  readonly #dialogRef = inject(MatDialogRef<UploadAssetsDialogComponent>);
  readonly #snackBar = inject(MatSnackBar);
  readonly #auroraFtpService = inject(AuroraFtpService);
  readonly #auroraHttpService = inject(AuroraHttpService);
  readonly inputData = inject<UploadAssetsDialogData>(MAT_DIALOG_DATA);
  cancelUpload: boolean;
  isUploadAssetsCompleted: boolean;
  isUploadInProgress: boolean;
  uploadAssetsStatusText: string;

  constructor() {
    this.cancelUpload = false;
    this.isUploadAssetsCompleted = false;
    this.isUploadInProgress = false;
    this.uploadAssetsStatusText = '';
  }

  ngOnDestroy() {
    this.cancelUpload = true;
  }

  get isUploadAssetsDisabled(): boolean {
    return this.isUploadInProgress;
  }

  onCancelClick(): void {
    this.cancelUpload = true;
    this.#dialogRef.close();
  }

  onCloseClick(): void {
    this.cancelUpload = true;
    this.#dialogRef.close(this.isUploadAssetsCompleted);
  }

  onLaunchAuroraClick() {
    this.#auroraHttpService
      .login(this.inputData.gameConsoleConfiguration)
      .then(() => {
        return this.#auroraHttpService.launchLauncher(
          this.inputData.gameConsoleConfiguration,
        );
      })
      .catch((error) => {
        console.error(
          'Failed to launch launcher. Got the following error:',
          error,
        );
        this.#snackBar.open('Failed to launch Aurora', '', {
          duration: 3000,
        });
      });
  }

  onUploadAssetsClick() {
    this.isUploadInProgress = true;
    this.uploadAssetsStatusText = 'Upload Progress: Uploading assets...';
    this.#auroraFtpService
      .uploadAuroraGameAssets(
        this.inputData.gameConsoleConfiguration,
        this.inputData.gameData,
      )
      .then(() => {
        this.isUploadAssetsCompleted = true;
        this.uploadAssetsStatusText =
          'Upload Progress: Successfully uploaded assets';
      })
      .catch((error) => {
        console.error(
          'Failed to upload assets. Got the following error:',
          error,
        );
        this.uploadAssetsStatusText =
          'Upload Progress: Failed to upload assets';
        this.#snackBar.open('Failed to upload assets', '', {
          duration: 3000,
        });
      })
      .finally(() => {
        this.isUploadInProgress = false;
      });
  }
}
