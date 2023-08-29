import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ConfirmationDialog } from '../../interfaces/confirmation-dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.sass'],
})
export class ConfirmationDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public inputData: ConfirmationDialog) {}
}
