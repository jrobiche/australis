import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable, inject, computed, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import {
  AuroraAssetType,
  AuroraGameData,
  AuroraScreencaptureMeta,
} from '@app/types/aurora';
import { ConfirmationDialogComponent } from '@app/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData, UploadAssetsDialogData } from '@app/types/app';
import { CoverInfoItem } from '@app/types/xbox-unity';
import { CreateUpdateConsoleDialogComponent } from '@app/components/dialogs/create-update-console-dialog/create-update-console-dialog.component';
import { DeleteConsoleDialogComponent } from '@app/components/dialogs/delete-console-dialog/delete-console-dialog.component';
import { DownloadGameDataDialogComponent } from '@app/components/dialogs/download-game-data-dialog/download-game-data-dialog.component';
import { GameConsoleConfiguration, GameListEntry } from '@app/types/app';
import { LiveImage } from '@app/types/xbox-catalog';
import { UploadAssetsDialogComponent } from '@app/components/dialogs/upload-assets-dialog/upload-assets-dialog.component';
import { XboxcatalogAssetBrowserDialogComponent } from '@app/components/dialogs/xboxcatalog-asset-browser-dialog/xboxcatalog-asset-browser-dialog.component';
import { XboxunityCoverBrowserDialogComponent } from '@app/components/dialogs/xboxunity-cover-browser-dialog/xboxunity-cover-browser-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  readonly #breakpointObserver = inject(BreakpointObserver);
  readonly #dialog = inject(MatDialog);
  readonly #snackBar = inject(MatSnackBar);

  #fontSize: 'small' | 'medium' | 'large';

  constructor() {
    // TODO allow this to be configured through settings
    this.#fontSize = 'medium';
  }

  get isFontSizeSmall(): boolean {
    return this.#fontSize == 'small';
  }

  get isFontSizeMedium(): boolean {
    return this.#fontSize == 'medium';
  }

  get isFontSizeLarge(): boolean {
    return this.#fontSize == 'large';
  }

  ////////////////////////////////////////////////////////////////////////////////
  // breakpoint methods
  ////////////////////////////////////////////////////////////////////////////////
  get isHandset(): boolean {
    return this.#breakpointObserver.isMatched(Breakpoints.Handset);
  }

  isHandset$: Observable<boolean> = this.#breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay(1),
    );

  get isTablet(): boolean {
    return this.#breakpointObserver.isMatched(Breakpoints.Tablet);
  }

  isTablet$: Observable<boolean> = this.#breakpointObserver
    .observe(Breakpoints.Tablet)
    .pipe(
      map((result) => result.matches),
      shareReplay(1),
    );

  get isWeb(): boolean {
    return this.#breakpointObserver.isMatched(Breakpoints.Web);
  }

  isWeb$: Observable<boolean> = this.#breakpointObserver
    .observe(Breakpoints.Web)
    .pipe(
      map((result) => result.matches),
      shareReplay(1),
    );

  ////////////////////////////////////////////////////////////////////////////////
  // dialog methods
  ////////////////////////////////////////////////////////////////////////////////
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

  ////////////////////////////////////////////////////////////////////////////////
  // misc functions
  ////////////////////////////////////////////////////////////////////////////////
  compareConsoleScreencaptureMetas(
    a: AuroraScreencaptureMeta,
    b: AuroraScreencaptureMeta,
  ) {
    // sort by timestamp from newest to oldest
    const timestampA = a.timestamp.toUpperCase();
    const timestampB = b.timestamp.toUpperCase();
    if (timestampA < timestampB) {
      return 1;
    }
    if (timestampA > timestampB) {
      return -1;
    }
    return 0;
  }

  compareGameListEntries(a: GameListEntry, b: GameListEntry) {
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

  compareGameConsoleConfigurations(
    a: GameConsoleConfiguration,
    b: GameConsoleConfiguration,
  ) {
    // compare names
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names are the same, compare ids
    const idA = a.id.toUpperCase();
    const idB = b.id.toUpperCase();
    if (idA < idB) {
      return -1;
    }
    if (idA > idB) {
      return 1;
    }
    return 0;
  }

  assetTypeText(assetType: AuroraAssetType | null): string {
    switch (assetType) {
      case AuroraAssetType.Icon:
        return 'Icon';
      case AuroraAssetType.Banner:
        return 'Banner';
      case AuroraAssetType.Boxart:
        return 'Boxart';
      case AuroraAssetType.Slot:
        return 'Slot';
      case AuroraAssetType.Background:
        return 'Background';
      case AuroraAssetType.Screenshot1:
        return 'Screenshot 1';
      case AuroraAssetType.Screenshot2:
        return 'Screenshot 2';
      case AuroraAssetType.Screenshot3:
        return 'Screenshot 3';
      case AuroraAssetType.Screenshot4:
        return 'Screenshot 4';
      case AuroraAssetType.Screenshot5:
        return 'Screenshot 5';
      case AuroraAssetType.Screenshot6:
        return 'Screenshot 6';
      case AuroraAssetType.Screenshot7:
        return 'Screenshot 7';
      case AuroraAssetType.Screenshot8:
        return 'Screenshot 8';
      case AuroraAssetType.Screenshot9:
        return 'Screenshot 9';
      case AuroraAssetType.Screenshot10:
        return 'Screenshot 10';
      case AuroraAssetType.Screenshot11:
        return 'Screenshot 11';
      case AuroraAssetType.Screenshot12:
        return 'Screenshot 12';
      case AuroraAssetType.Screenshot13:
        return 'Screenshot 13';
      case AuroraAssetType.Screenshot14:
        return 'Screenshot 14';
      case AuroraAssetType.Screenshot15:
        return 'Screenshot 15';
      case AuroraAssetType.Screenshot16:
        return 'Screenshot 16';
      case AuroraAssetType.Screenshot17:
        return 'Screenshot 17';
      case AuroraAssetType.Screenshot18:
        return 'Screenshot 18';
      case AuroraAssetType.Screenshot19:
        return 'Screenshot 19';
      case AuroraAssetType.Screenshot20:
        return 'Screenshot 20';
      default:
        return 'Unknown';
    }
  }
}
