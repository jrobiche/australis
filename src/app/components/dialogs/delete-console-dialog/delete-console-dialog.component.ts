import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { GameConsoleConfiguration } from '@app/types/app';
import { GameConsoleConfigurationService } from '@app/services/game-console-configuration.service';

@Component({
  selector: 'app-delete-console-dialog',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './delete-console-dialog.component.html',
  styleUrl: './delete-console-dialog.component.sass',
})
export class DeleteConsoleDialogComponent {
  readonly #dialogRef = inject(MatDialogRef<DeleteConsoleDialogComponent>);
  readonly #gameConsoleConfigurationService = inject(
    GameConsoleConfigurationService,
  );
  readonly #snackBar = inject(MatSnackBar);
  readonly inputData = inject<GameConsoleConfiguration>(MAT_DIALOG_DATA);

  onCancelClick(): void {
    this.#dialogRef.close(null);
  }

  onDeleteClick(): void {
    this.#gameConsoleConfigurationService
      .delete(this.inputData.id)
      .then(() => {
        this.#dialogRef.close(this.inputData.id);
      })
      .catch((error) => {
        console.error(
          `Failed to delete console configuration with id '${this.inputData.id}'. Got the following error:`,
          error,
        );
        this.#snackBar.open('Failed to delete console', '', {
          duration: 3000,
        });
      });
  }
}
