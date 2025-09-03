import { Component, OnInit, inject, model } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

import { GameConsoleConfiguration } from '@app/types/app';
import { GameConsoleConfigurationService } from '@app/services/game-console-configuration.service';

@Component({
  selector: 'app-create-update-console-dialog',
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-update-console-dialog.component.html',
  styleUrl: './create-update-console-dialog.component.sass',
})
export class CreateUpdateConsoleDialogComponent implements OnInit {
  readonly #dialogRef = inject(
    MatDialogRef<CreateUpdateConsoleDialogComponent>,
  );
  readonly #formBuilder = inject(FormBuilder);
  readonly #gameConsoleConfigurationService = inject(
    GameConsoleConfigurationService,
  );
  readonly #snackBar = inject(MatSnackBar);
  readonly inputData = inject<GameConsoleConfiguration>(MAT_DIALOG_DATA);
  gameConsoleConfigurationForm: FormGroup;
  isAuroraFtpPasswordVisible: boolean;
  isAuroraHttpPasswordVisible: boolean;

  constructor() {
    this.gameConsoleConfigurationForm = this.#formBuilder.group({
      name: [null, [Validators.required]],
      ipAddress: [null, [Validators.required]],
      auroraFtpPort: [21, [Validators.required]],
      auroraFtpUsername: ['xboxftp', []],
      auroraFtpPassword: ['xboxftp', []],
      auroraHttpPort: [9999, [Validators.required]],
      auroraHttpUsername: ['xboxhttp', []],
      auroraHttpPassword: ['xboxhttp', []],
    });
    this.isAuroraFtpPasswordVisible = false;
    this.isAuroraHttpPasswordVisible = false;
  }

  ngOnInit(): void {
    if (this.inputData) {
      this.gameConsoleConfigurationForm = this.#formBuilder.group({
        name: [this.inputData.name, [Validators.required]],
        ipAddress: [this.inputData.ipAddress, [Validators.required]],
        auroraFtpPort: [this.inputData.auroraFtpPort, [Validators.required]],
        auroraFtpUsername: [this.inputData.auroraFtpUsername, []],
        auroraFtpPassword: [this.inputData.auroraFtpPassword, []],
        auroraHttpPort: [this.inputData.auroraHttpPort, [Validators.required]],
        auroraHttpUsername: [this.inputData.auroraHttpUsername, []],
        auroraHttpPassword: [this.inputData.auroraHttpPassword, []],
      });
    }
  }

  get titleText(): string {
    if (this.inputData) {
      return 'Edit Console';
    }
    return 'Add Console';
  }

  onCancelClick(): void {
    this.#dialogRef.close();
  }

  onSubmitClick(): void {
    if (this.gameConsoleConfigurationForm.valid) {
      if (this.inputData) {
        this.#updateConsoleConfiguration();
      } else {
        this.#createConsoleConfiguration();
      }
    }
  }

  #createConsoleConfiguration(): void {
    this.#gameConsoleConfigurationService
      .create(
        this.gameConsoleConfigurationForm.value as GameConsoleConfiguration,
      )
      .then((configuration) => {
        this.#dialogRef.close(configuration);
      })
      .catch((error) => {
        console.error(
          'Failed to create console configuration. Got the following error:',
          error,
        );
        this.#snackBar.open('Failed to create console', '', {
          duration: 3000,
        });
      });
  }

  #updateConsoleConfiguration(): void {
    this.#gameConsoleConfigurationService
      .update(
        this.inputData.id,
        this.gameConsoleConfigurationForm.value as GameConsoleConfiguration,
      )
      .then((configuration) => {
        this.#dialogRef.close(configuration);
      })
      .catch((error) => {
        console.error(
          'Failed to update console configuration. Got the following error:',
          error,
        );
        this.#snackBar.open('Failed to update console', '', {
          duration: 3000,
        });
      });
  }
}
