import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuroraGameData } from '@app/modules/aurora/types/aurora';
import { XboxcatalogService } from '@app/modules/xbox-catalog/services/xboxcatalog.service';
import { LiveImage } from '@app/modules/xbox-catalog/types/xbox-catalog';
import { LiveImageCardComponent } from './live-image-card/live-image-card.component';

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
    // TODO support locale code selection
    let localeCode = 'en-US';
    this.#xboxcatalogService
      .liveImagesForTitleId(this.gameData.titleId, localeCode)
      .then((liveImages) => {
        this.liveImages = liveImages.sort(this.#compareLiveImages);
      })
      .catch((error) => {
        console.error(
          'Failed to load image data from xbox catalog. Got the following error:',
          error,
        );
        this.#snackBar.open('Failed to load image data.', '', {
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

  #compareLiveImages(a: LiveImage, b: LiveImage) {
    // sort by: icon -> banner -> boxart (small) -> boxart (large) -> background -> everything else
    if (a.relationshipType == 23) {
      return -1;
    } else if (b.relationshipType == 23) {
      return 1;
    } else if (a.relationshipType == 27) {
      return -1;
    } else if (b.relationshipType == 27) {
      return 1;
    } else if (a.relationshipType == 33 && a.size == 30) {
      return -1;
    } else if (b.relationshipType == 33 && b.size == 30) {
      return 1;
    } else if (a.relationshipType == 33 && a.size == 23) {
      return -1;
    } else if (b.relationshipType == 33 && b.size == 23) {
      return 1;
    } else if (a.relationshipType == 22) {
      return -1;
    } else if (b.relationshipType == 22) {
      return 1;
    }
    return 0;
  }
}
