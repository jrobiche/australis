import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuroraGameData } from '@app/modules/aurora/types/aurora';
import {
  CoverInfoItem,
  CoverInfoResult,
  TitleListResult,
} from '@app/modules/xbox-unity/types/xbox-unity';
import { TitleCardComponent } from './title-card/title-card.component';
import { XboxunityService } from '@app/modules/xbox-unity/services/xboxunity.service';

@Component({
  selector: 'app-xboxunity-cover-browser-dialog',
  imports: [MatButtonModule, MatDialogModule, TitleCardComponent],
  templateUrl: './xboxunity-cover-browser-dialog.component.html',
  styleUrl: './xboxunity-cover-browser-dialog.component.sass',
})
export class XboxunityCoverBrowserDialogComponent implements OnInit {
  readonly #dialogRef = inject(
    MatDialogRef<XboxunityCoverBrowserDialogComponent>,
  );
  readonly #snackBar = inject(MatSnackBar);
  readonly #xboxunityService = inject(XboxunityService);
  // TODO do not allow `null`
  readonly gameData = inject<AuroraGameData | null>(MAT_DIALOG_DATA);
  coverInfoResult: CoverInfoResult | null;
  titleListResult: TitleListResult | null;

  constructor() {
    this.coverInfoResult = null;
    this.titleListResult = null;
  }

  // TODO support pagination
  ngOnInit(): void {
    let page = 0;
    let count = 10;
    let query = this.titleIdString;
    this.#xboxunityService
      .titleList(query, page, count)
      .then((result) => {
        this.titleListResult = result;
      })
      .catch((error) => {
        this.coverInfoResult = null;
        this.titleListResult = null;
        console.error(
          `Failed to load title list with query: '${query}'. Got the following error:`,
          error,
        );
        this.#snackBar.open('Failed to load titles', 'Close');
      });
  }

  get titleIdString(): string {
    if (this.gameData?.titleId || this.gameData?.titleId == 0) {
      return this.gameData?.titleId.toString(16).padStart(8, '0').toUpperCase();
    }
    return '';
  }

  onCancelClick(): void {
    this.#dialogRef.close(null);
  }

  onCoverSelected(cover: CoverInfoItem): void {
    this.#dialogRef.close(cover);
  }
}
