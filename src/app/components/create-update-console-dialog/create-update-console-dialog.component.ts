import { Component, inject, model } from '@angular/core';
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
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { GameConsoleConfiguration } from '../../interfaces/game-console-configuration';

@Component({
  selector: 'app-create-update-console-dialog',
  imports: [
    FormsModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-update-console-dialog.component.html',
  styleUrl: './create-update-console-dialog.component.sass',
})
export class CreateUpdateConsoleDialogComponent {
  readonly dialogRef = inject(MatDialogRef<CreateUpdateConsoleDialogComponent>);
  readonly inputData = inject<GameConsoleConfiguration>(MAT_DIALOG_DATA);
  private _formBuilder = inject(FormBuilder);
  gameConsoleConfigurationForm: FormGroup;
  auroraFtpPasswordVisible: boolean;
  auroraHttpPasswordVisible: boolean;

  constructor() {
    this.gameConsoleConfigurationForm = this._formBuilder.group({
      name: [null, [Validators.required]],
      ipAddress: ['0.0.0.0', [Validators.required]],
      auroraFtpPort: [21, [Validators.required]],
      auroraFtpUsername: ['xboxftp', []],
      auroraFtpPassword: ['xboxftp', []],
      auroraHttpPort: [9999, [Validators.required]],
      auroraHttpUsername: ['xboxhttp', []],
      auroraHttpPassword: ['xboxhttp', []],
    });
    this.auroraFtpPasswordVisible = false;
    this.auroraHttpPasswordVisible = false;
  }

  ngOnInit(): void {
    if (this.inputData) {
      this.gameConsoleConfigurationForm = this._formBuilder.group({
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

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSubmitClick(): void {
    if (this.gameConsoleConfigurationForm.valid) {
      this.dialogRef.close(this.gameConsoleConfigurationForm.value);
    }
  }
}
