import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuroraGameData } from '@app/types/aurora';
import { LiveImage } from '@app/types/xbox-catalog';
import { LiveImageCardComponent } from './live-image-card/live-image-card.component';
import { XboxcatalogService } from '@app/services/xboxcatalog.service';

@Component({
  selector: 'app-xboxcatalog-asset-browser-dialog',
  imports: [MatButtonModule, MatDialogModule, LiveImageCardComponent],
  templateUrl: './xboxcatalog-asset-browser-dialog.component.html',
  styleUrl: './xboxcatalog-asset-browser-dialog.component.sass',
})
export class XboxcatalogAssetBrowserDialogComponent implements OnInit {
  readonly #dialogRef = inject(
    MatDialogRef<XboxcatalogAssetBrowserDialogComponent>,
  );
  readonly #snackBar = inject(MatSnackBar);
  readonly #xboxcatalogService = inject(XboxcatalogService);
  readonly gameData = inject<AuroraGameData>(MAT_DIALOG_DATA);
  liveImages: LiveImage[];

  constructor() {
    this.liveImages = [];
  }

  ngOnInit() {
    let titleIdString = this.gameData.titleId
      .toString(16)
      .padStart(8, '0')
      .toUpperCase();
    // TODO support locale selection
    let locale = 'en-US';
    this.#xboxcatalogService
      .liveImagesForTitleId(titleIdString, locale)
      .then((liveImages) => {
        this.liveImages = liveImages;
      })
      .catch((error) => {
        console.error(
          'Failed to load image data from xbox catalog. Got the following error:',
          error,
        );
        this.#snackBar.open('Failed to load image data', '', {
          duration: 3000,
        });
      });
  }

  onCancelClick(): void {
    this.#dialogRef.close(null);
  }

  onImageSelected(liveImage: LiveImage): void {
    this.#dialogRef.close(liveImage);
  }
}
