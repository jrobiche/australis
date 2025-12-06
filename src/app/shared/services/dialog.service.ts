import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';

// types
import { AuroraGameData } from '@app/modules/aurora/types/aurora';
import {
  ConfirmationDialogData,
  UploadAssetsDialogData,
} from '@app/shared/types/app';
import { CoverInfoItem } from '@app/modules/xbox-unity/types/xbox-unity';
import { GameConsoleConfiguration } from '@app/shared/types/app';
import { LiveImage } from '@app/modules/xbox-catalog/types/xbox-catalog';
// components
import { ConfirmationDialogComponent } from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { CreateUpdateConsoleDialogComponent } from '@app/shared/components/create-update-console-dialog/create-update-console-dialog.component';
import { DeleteConsoleDialogComponent } from '@app/shared/components/delete-console-dialog/delete-console-dialog.component';
import { DownloadGameDataDialogComponent } from '@app/shared/components/download-game-data-dialog/download-game-data-dialog.component';
import { UploadAssetsDialogComponent } from '@app/shared/components/upload-assets-dialog/upload-assets-dialog.component';
import { XboxcatalogAssetBrowserDialogComponent } from '@app/shared/components/xboxcatalog-asset-browser-dialog/xboxcatalog-asset-browser-dialog.component';
import { XboxunityCoverBrowserDialogComponent } from '@app/shared/components/xboxunity-cover-browser-dialog/xboxunity-cover-browser-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  readonly #dialog = inject(MatDialog);

  constructor() {}

  /**
   * return `true` if confirmation was clicked
   * return `false` if cancel was clicked
   * otherwise return `null`
   */
  openConfirmationDialog(
    data: ConfirmationDialogData,
  ): Observable<boolean | null> {
    let subject = new Subject<boolean | null>();
    this.#dialog
      .open(ConfirmationDialogComponent, { data: data })
      .afterClosed()
      .subscribe((result) => {
        if (result === true || result === false) {
          subject.next(result);
        } else {
          subject.next(null);
        }
      });
    return subject.asObservable();
  }

  /**
   * return `GameConsoleConfiguration` if a new console configuration was created
   * otherwise return `null`
   */
  openCreateConsoleDialog(): Observable<GameConsoleConfiguration | null> {
    let subject = new Subject<GameConsoleConfiguration | null>();
    this.#dialog
      .open(CreateUpdateConsoleDialogComponent, {
        data: null,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          subject.next(result);
        }
        subject.next(null);
      });
    return subject.asObservable();
  }

  /**
   * return the console configuration id if console configuration was deleted or never existed
   * otherwise return `null`
   */
  openDeleteConsoleDialog(
    configuration: GameConsoleConfiguration,
  ): Observable<string | null> {
    let subject = new Subject<string | null>();
    this.#dialog
      .open(DeleteConsoleDialogComponent, {
        data: configuration,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          subject.next(result);
        }
        subject.next(null);
      });
    return subject.asObservable();
  }

  /**
   * return `true` if any data was downloaded
   * otherwise return `false`
   */
  openDownloadGameDataDialog(
    configuration: GameConsoleConfiguration,
  ): Observable<boolean> {
    let subject = new Subject<boolean>();
    this.#dialog
      .open(DownloadGameDataDialogComponent, { data: configuration })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          subject.next(true);
        }
        subject.next(false);
      });
    return subject.asObservable();
  }

  /**
   * return `GameConsoleConfiguration` if an existing console configuration was updated
   * otherwise return `null`
   */
  openUpdateConsoleDialog(
    configuration: GameConsoleConfiguration,
  ): Observable<GameConsoleConfiguration | null> {
    let subject = new Subject<GameConsoleConfiguration | null>();
    this.#dialog
      .open(CreateUpdateConsoleDialogComponent, {
        data: configuration,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          subject.next(result);
        }
        subject.next(null);
      });
    return subject.asObservable();
  }

  /**
   * return `true` if any data was uploaded
   * otherwise reutrn `false`
   */
  openUploadAssetsDialog(data: UploadAssetsDialogData): Observable<boolean> {
    let subject = new Subject<boolean>();
    this.#dialog
      .open(UploadAssetsDialogComponent, {
        data: data,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          subject.next(true);
        }
        subject.next(false);
      });
    return subject.asObservable();
  }

  /**
   * return `LiveImage` if an image was selected
   * otherwise return `null`
   */
  openXboxCatalogAssetBrowserDialog(
    data: AuroraGameData,
  ): Observable<LiveImage | null> {
    let subject = new Subject<null>();
    this.#dialog
      .open(XboxcatalogAssetBrowserDialogComponent, { data: data })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          subject.next(result);
        } else {
          subject.next(null);
        }
      });
    return subject.asObservable();
  }

  /**
   * return `CoverInfoItem` if a cover was selected
   * otherwise return `null`
   */
  openXboxUnityCoverBrowserDialog(
    data: AuroraGameData | null,
  ): Observable<CoverInfoItem | null> {
    let subject = new Subject<CoverInfoItem | null>();
    this.#dialog
      .open(XboxunityCoverBrowserDialogComponent, { data: data })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          subject.next(result);
        } else {
          subject.next(null);
        }
      });
    return subject.asObservable();
  }
}
