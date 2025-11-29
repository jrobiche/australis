import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import {
  AuroraAssetType,
  AuroraGameData,
} from '@app/modules/aurora/types/aurora';
import { AuroraStateService } from '@app/modules/aurora/services/aurora-state.service';
import { XboxcatalogService } from '@app/modules/xbox-catalog/services/xboxcatalog.service';
import { XboxunityService } from '@app/modules/xbox-unity/services/xboxunity.service';
import { DialogService } from '@app/shared/services/dialog.service';
import {
  ConfirmationDialogData,
  GameConsoleConfiguration,
} from '@app/shared/types/app';

@Component({
  selector: 'app-edit-asset-card',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './edit-asset-card.component.html',
  styleUrl: './edit-asset-card.component.sass',
})
export class EditAssetCardComponent implements OnChanges, OnInit {
  readonly #auroraState = inject(AuroraStateService);
  readonly #dialogService = inject(DialogService);
  readonly #snackBar = inject(MatSnackBar);
  readonly #xboxcatalogService = inject(XboxcatalogService);
  readonly #xboxunityService = inject(XboxunityService);
  @Input({ required: true })
  assetType!: AuroraAssetType;
  @Input({ required: true })
  gameConsoleConfiguration!: GameConsoleConfiguration;
  @Input({ required: true })
  gameData!: AuroraGameData;
  @ViewChild('fileInput')
  _fileInput: ElementRef<HTMLInputElement> | null;
  assetImageBytesNew: Uint8Array;
  assetImageUrlCurrent: string | null;
  assetImageUrlNew: string | null;
  hasError: boolean;
  isLoadingImage: boolean;

  constructor() {
    this._fileInput = null;
    this.assetImageBytesNew = new Uint8Array();
    this.assetImageUrlCurrent = null;
    this.assetImageUrlNew = null;
    this.hasError = false;
    this.isLoadingImage = false;
  }

  ngOnInit() {
    this.#loadAssetImageUrl(this.assetType).then((imageUrl) => {
      this.assetImageUrlCurrent = imageUrl;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (Object.hasOwn(changes, 'gameData')) {
      this.#resetData();
    }
  }

  get deleteAssetTooltipText(): string {
    return `Delete ${this.#assetTypeText(this.assetType).toLowerCase()} image`;
  }

  get displayedAssetImageAltText(): string {
    return `${this.#assetTypeText(this.assetType)} image`;
  }

  get displayedAssetImageUrl(): string | null {
    if (this.assetImageUrlNew) {
      return this.assetImageUrlNew;
    }
    return this.assetImageUrlCurrent;
  }

  get headerText(): string {
    return this.#assetTypeText(this.assetType);
  }

  get isDeleteAssetDisabled(): boolean {
    return this.displayedAssetImageUrl == null;
  }

  onApplyClick() {
    this.#auroraState.game
      .updateAssetImage(
        this.gameConsoleConfiguration,
        this.gameData,
        this.assetType,
        this.assetImageBytesNew,
      )
      .catch((error) => {
        console.error(
          'Failed to set asset image. Got the following error:',
          error,
        );
        this.#snackBar.open('Failed to set asset image.', '', {
          duration: 3000,
        });
      })
      .finally(() => {
        this.#resetData();
      });
  }

  onCancelClick() {
    this.#resetData();
  }

  onDeleteClick() {
    let gameData = this.gameData;
    let assetType = this.assetType;
    let consoleConfiguration = this.gameConsoleConfiguration;
    let dialogData: ConfirmationDialogData = {
      title: 'Delete Console',
      bodyParagraphs: [
        `Delete image for ${this.#assetTypeText(this.assetType).toLowerCase()} asset?`,
      ],
      confirmButtonText: 'Delete',
    };
    this.#dialogService
      .openConfirmationDialog(dialogData)
      .subscribe((result) => {
        if (result !== true) {
          return;
        }
        this.#auroraState.game
          .deleteAssetImage(consoleConfiguration, gameData, assetType)
          .catch((error) => {
            console.error(
              'Failed to delete asset image. Got the following error:',
              error,
            );
            this.#snackBar.open('Failed to delete asset image.', '', {
              duration: 3000,
            });
          })
          .finally(() => {
            this.#resetData();
          });
      });
  }

  onUploadFileChange(event: any) {
    let data = event.srcElement.files[0];
    if (data) {
      data
        .arrayBuffer()
        .then((buffer: ArrayBuffer) => {
          this.assetImageUrlNew = URL.createObjectURL(data);
          this.assetImageBytesNew = new Uint8Array(buffer);
        })
        .catch((error: any) => {
          console.error('Failed to load file. Got the following error:', error);
          this.#snackBar.open('Failed to load file.', '', {
            duration: 3000,
          });
          this.#resetData();
        });
    }
  }

  onXboxCatalogCoversClick() {
    this.#dialogService
      .openXboxCatalogAssetBrowserDialog(this.gameData)
      .subscribe((result) => {
        if (result) {
          this.isLoadingImage = true;
          this.#xboxcatalogService
            .liveImageBytesUrl(result)
            .then((url: string | null) => {
              this.assetImageUrlNew = url;
              if (url) {
                let base64Data: string = url.split(';base64,')[1];
                this.assetImageBytesNew = this.#base64ToArrayBuffer(base64Data);
              } else {
                this.assetImageBytesNew = new Uint8Array();
              }
              this.isLoadingImage = false;
            })
            .catch((error) => {
              console.error(
                'Failed to load image bytes. Got the following error:',
                error,
              );
              this.#snackBar.open('Failed to load image.', '', {
                duration: 3000,
              });
              this.#resetData();
            });
        }
      });
  }

  onXboxUnityCoversClick() {
    this.#dialogService
      .openXboxUnityCoverBrowserDialog(this.gameData)
      .subscribe((result) => {
        if (result) {
          this.isLoadingImage = true;
          this.#xboxunityService
            .coverImageBytesUrl(result.CoverID, 'large')
            .then((url: string | null) => {
              this.assetImageUrlNew = url;
              if (url) {
                let base64Data: string = url.split(';base64,')[1];
                this.assetImageBytesNew = this.#base64ToArrayBuffer(base64Data);
              } else {
                this.assetImageBytesNew = new Uint8Array();
              }
              this.isLoadingImage = false;
            })
            .catch((error) => {
              console.error(
                'Failed to load image bytes. Got the following error:',
                error,
              );
              this.#snackBar.open('Failed to load image.', '', {
                duration: 3000,
              });
              this.#resetData();
            });
        }
      });
  }

  #assetTypeText(assetType: AuroraAssetType | null): string {
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

  #base64ToArrayBuffer(base64: string): Uint8Array {
    var binaryString = atob(base64);
    var bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    // return bytes.buffer;
    return bytes;
  }

  #loadAssetImageUrl(assetType: AuroraAssetType): Promise<string | null> {
    this.isLoadingImage = true;
    return this.#auroraState.game
      .assetImageUrl(this.gameConsoleConfiguration, this.gameData, assetType)
      .catch((error) => {
        console.error(
          'Failed to load asset image. Got the following error:',
          error,
        );
        this.#snackBar.open('Failed to load image.', '', {
          duration: 3000,
        });
        this.hasError = true;
        return null;
      })
      .finally(() => {
        this.isLoadingImage = false;
      });
  }

  #resetData(): void {
    this.assetImageBytesNew = new Uint8Array();
    this.assetImageUrlCurrent = null;
    this.assetImageUrlNew = null;
    this.hasError = false;
    this.isLoadingImage = false;
    this.#resetFileInput();
    this.#loadAssetImageUrl(this.assetType).then((imageUrl) => {
      this.assetImageUrlCurrent = imageUrl;
    });
  }

  #resetFileInput(): void {
    if (this._fileInput) {
      this._fileInput.nativeElement.value =
        this._fileInput.nativeElement.defaultValue;
    }
  }
}
