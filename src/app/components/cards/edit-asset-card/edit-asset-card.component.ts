import {
  Component,
  ElementRef,
  Input,
  OnInit,
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

import { AuroraAssetType, AuroraGameData } from '@app/types/aurora';
import { AuroraGameService } from '@app/services/aurora-game.service';
import { ConfirmationDialogData } from '@app/types/app';
import { GameConsoleConfiguration } from '@app/types/app';
import { XboxcatalogService } from '@app/services/xboxcatalog.service';
import { XboxunityService } from '@app/services/xboxunity.service';
import { UiService } from '@app/services/ui.service';

// TODO attempt to simplify logic
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
export class EditAssetCardComponent implements OnInit {
  readonly #auroraGameService = inject(AuroraGameService);
  readonly #snackBar = inject(MatSnackBar);
  readonly #uiService = inject(UiService);
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
  assetImageUrlDisplayed: string | null;
  assetImageUrlNew: string | null;
  hasError: boolean;
  isLoadingImage: boolean;

  constructor() {
    this._fileInput = null;
    this.assetImageBytesNew = new Uint8Array();
    this.assetImageUrlCurrent = null;
    this.assetImageUrlDisplayed = null;
    this.assetImageUrlNew = null;
    this.hasError = false;
    this.isLoadingImage = false;
  }

  ngOnInit() {
    this.#loadAssetImageUrl(this.assetType)
      .then((imageUrl) => {
        this.assetImageUrlCurrent = imageUrl;
        this.assetImageUrlDisplayed = this.assetImageUrlCurrent;
      })
      .catch((error) => {
        console.error(
          'Failed to load asset image. Got the following error:',
          error,
        );
      });
  }

  get deleteAssetTooltipText(): string {
    return `Delete ${this.#uiService.assetTypeText(this.assetType).toLowerCase()} image`;
  }

  get displayedAssetImageAltText(): string {
    return `${this.#uiService.assetTypeText(this.assetType)} image`;
  }

  get displayedAssetImageUrl(): string | null {
    if (this.assetImageUrlNew) {
      return this.assetImageUrlNew;
    }
    return this.assetImageUrlCurrent;
  }

  get headerText(): string {
    return this.#uiService.assetTypeText(this.assetType);
  }

  get isDeleteAssetDisabled(): boolean {
    return this.displayedAssetImageUrl == null;
  }

  async onApplyClick() {
    try {
      await this.#auroraGameService.updateAssetImage(
        this.gameConsoleConfiguration,
        this.gameData,
        this.assetType,
        this.assetImageBytesNew,
      );
    } catch (error) {
      this.#snackBar.open('Failed to set asset image', '', {
        duration: 3000,
      });
    } finally {
      this.#loadAssetImageUrl(this.assetType).then((imageUrl) => {
        this.assetImageUrlCurrent = imageUrl;
      });
      this.assetImageUrlNew = null;
      this.assetImageBytesNew = new Uint8Array([]);
      this.#resetFileInput();
    }
  }

  onCancelClick() {
    this.assetImageUrlNew = null;
    this.#resetFileInput();
    this.assetImageBytesNew = new Uint8Array([]);
  }

  onDeleteClick() {
    let gameData = this.gameData;
    let assetType = this.assetType;
    let consoleConfiguration = this.gameConsoleConfiguration;
    let dialogData: ConfirmationDialogData = {
      title: 'Delete Console',
      bodyParagraphs: [
        `Delete image for ${this.#uiService.assetTypeText(this.assetType).toLowerCase()} asset?`,
      ],
      confirmButtonText: 'Delete',
    };
    this.#uiService.openConfirmationDialog(dialogData).subscribe((result) => {
      if (result !== true) {
        return Promise.resolve();
      }
      return this.#auroraGameService
        .deleteAssetImage(consoleConfiguration, gameData, assetType)
        .catch((error) => {
          this.#snackBar.open('Failed to delete asset image', '', {
            duration: 3000,
          });
        })
        .finally(() => {
          this.assetImageUrlNew = null;
          this.#resetFileInput();
          this.assetImageBytesNew = new Uint8Array([]);
          this.#loadAssetImageUrl(this.assetType)
            .then((imageUrl) => {
              this.assetImageUrlCurrent = imageUrl;
            })
            .catch((error) => {
              this.#snackBar.open(
                'Failed to load asset image after deletion',
                '',
                {
                  duration: 3000,
                },
              );
            });
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
          this.assetImageUrlNew = null;
          this.#resetFileInput();
          this.assetImageBytesNew = new Uint8Array([]);
          this.#snackBar.open('Failed to load file', '', {
            duration: 3000,
          });
        });
    }
  }

  onXboxCatalogCoversClick() {
    if (this.gameData == null) {
      // TODO snackbar?
      return;
    }
    this.#uiService
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
            })
            .catch((error) => {
              console.error(
                'Failed to load image bytes. Got the following error:',
                error,
              );
              this.#snackBar.open('Failed to load image', '', {
                duration: 3000,
              });
            })
            .finally(() => {
              this.isLoadingImage = false;
            });
        }
      });
  }

  onXboxUnityCoversClick() {
    this.#uiService
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
            })
            .catch((error) => {
              console.error(
                'Failed to load image bytes. Got the following error:',
                error,
              );
              this.#snackBar.open('Failed to load image', '', {
                duration: 3000,
              });
            })
            .finally(() => {
              this.isLoadingImage = false;
            });
        }
      });
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
    return this.#auroraGameService
      .assetImageUrl(this.gameConsoleConfiguration, this.gameData, assetType)
      .catch((error) => {
        this.hasError = true;
        return null;
      })
      .finally(() => {
        this.isLoadingImage = false;
      });
  }

  #resetFileInput(): void {
    if (this._fileInput) {
      this._fileInput.nativeElement.value =
        this._fileInput.nativeElement.defaultValue;
    }
  }
}
