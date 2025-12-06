import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuroraStateService } from '@app/modules/aurora/services/aurora-state.service';
import { AuroraScreencaptureMeta } from '@app/modules/aurora/types/aurora';
import { DialogService } from '@app/shared/services/dialog.service';
import {
  ConfirmationDialogData,
  GameConsoleConfiguration,
} from '@app/shared/types/app';

@Component({
  selector: 'app-screencaptures-card',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './screencaptures-card.component.html',
  styleUrl: './screencaptures-card.component.sass',
})
export class ScreencapturesCardComponent {
  readonly #auroraState = inject(AuroraStateService);
  readonly #dialogService = inject(DialogService);
  readonly #snackBar = inject(MatSnackBar);
  @Input({ required: true })
  gameConsoleConfiguration!: GameConsoleConfiguration;
  @Input()
  screencaptureMetas: AuroraScreencaptureMeta[];
  selectedScreencaptureMeta: AuroraScreencaptureMeta | null;
  selectedScreencaptureImageUrl: string | null;
  isScreencaptureLoading: boolean;
  pageIndex: number;
  pageSize: number;
  pageSizeOptions: number[];

  constructor() {
    this.screencaptureMetas = [];
    this.selectedScreencaptureMeta = null;
    this.selectedScreencaptureImageUrl = null;
    this.isScreencaptureLoading = false;
    this.pageIndex = 0;
    this.pageSizeOptions = [5, 10, 25, 100];
    this.pageSize = this.pageSizeOptions[0];
  }

  get screencaptureMetasPage(): AuroraScreencaptureMeta[] {
    let startIndex = this.pageIndex * this.pageSize;
    return this.screencaptureMetas.slice(
      startIndex,
      startIndex + this.pageSize,
    );
  }

  get screencaptureBackgroundImageStyle(): string | null {
    if (this.selectedScreencaptureImageUrl) {
      return `url('${this.selectedScreencaptureImageUrl}')`;
    }
    let lightRGBA = 'rgba(0, 0, 0, 0.1)';
    let darkRGBA = 'rgba(0, 0, 0, 0.5)';
    return `linear-gradient(light-dark(${lightRGBA}, ${darkRGBA}), light-dark(${lightRGBA}, ${darkRGBA}))`;
  }

  get isDeleteSelectedScreencaptureDisabled(): boolean {
    return this.selectedScreencaptureImageUrl == null;
  }

  get isTakeScreenshotDisabled(): boolean {
    return !this.#auroraState.isAuthenticated(this.gameConsoleConfiguration);
  }

  isSelectedScreencaptureOption(
    screencaptureMeta: AuroraScreencaptureMeta,
  ): boolean {
    return (
      this.selectedScreencaptureMeta != null &&
      screencaptureMeta.filename == this.selectedScreencaptureMeta.filename
    );
  }

  onDeleteClick(): void {
    let screencaptureMeta = this.selectedScreencaptureMeta;
    if (screencaptureMeta == null) {
      return;
    }
    let dialogData: ConfirmationDialogData = {
      title: 'Delete Screenshot',
      bodyParagraphs: [
        `Delete screenshot named ${screencaptureMeta.filename}?`,
      ],
      confirmButtonText: 'Delete',
    };
    this.#dialogService
      .openConfirmationDialog(dialogData)
      .subscribe((result) => {
        if (result) {
          this.#auroraState
            .deleteScreencapture(
              this.gameConsoleConfiguration,
              screencaptureMeta.filename,
            )
            .then(() => {
              if (
                this.selectedScreencaptureMeta?.filename ==
                screencaptureMeta.filename
              ) {
                this.selectedScreencaptureMeta = null;
                this.selectedScreencaptureImageUrl = null;
              }
            })
            .catch((error) => {
              console.error(
                'Failed to delete screenshot. Got the following error:',
                error,
              );
              this.#snackBar.open('Failed to delete screenshot.', 'Close');
            });
        }
      });
  }

  onScreencaptureSelectionChange(event: any): void {
    this.selectedScreencaptureImageUrl = null;
    this.selectedScreencaptureMeta = event.options[0].value;
    if (this.selectedScreencaptureMeta) {
      this.isScreencaptureLoading = true;
      this.#auroraState
        .screencaptureImageUrl(
          this.gameConsoleConfiguration,
          this.selectedScreencaptureMeta.filename,
        )
        .then((imageUrl) => {
          this.selectedScreencaptureImageUrl = imageUrl;
        })
        .catch((error) => {
          console.error(
            'Failed to load screenshot. Got the following error:',
            error,
          );
          this.#snackBar.open('Failed to load screenshot.', 'Close');
        })
        .finally(() => {
          this.isScreencaptureLoading = false;
        });
    }
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onTakeScreenshotClick(): void {
    this.#auroraState
      .takeScreencapture(this.gameConsoleConfiguration)
      .catch((error) => {
        console.error(
          'Failed to take screenshot. Got the following error:',
          error,
        );
        this.#snackBar.open('Failed to take screenshot.', 'Close');
      });
  }

  timestampText(timestamp: string): string {
    let value = timestamp;
    if (timestamp.length >= 14) {
      let year = timestamp.slice(0, 4);
      let month = timestamp.slice(4, 6);
      let day = timestamp.slice(6, 8);
      let hour = timestamp.slice(8, 10);
      let minute = timestamp.slice(10, 12);
      let second = timestamp.slice(12, 14);
      let millisecond = timestamp.slice(14);
      const date = new Date(
        `${year}-${month}-${day}T${hour}:${minute}:${second}.${millisecond}Z`,
      );
      value = date.toLocaleString();
    }
    return value;
  }
}
