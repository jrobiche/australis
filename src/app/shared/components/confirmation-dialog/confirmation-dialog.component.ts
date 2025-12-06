import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

import { ConfirmationDialogData } from '@app/shared/types/app';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
  ],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.sass',
})
export class ConfirmationDialogComponent {
  readonly #dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);
  readonly inputData = inject<ConfirmationDialogData>(MAT_DIALOG_DATA);

  onCancelClick(): void {
    this.#dialogRef.close(false);
  }

  onConfirmClick(): void {
    this.#dialogRef.close(true);
  }
}
