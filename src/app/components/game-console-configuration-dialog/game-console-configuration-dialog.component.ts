import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UiService } from '../../services/ui.service';
import { GameConsoleConfiguration } from '../../interfaces/game-console-configuration';

@Component({
  selector: 'app-game-console-configuration-dialog',
  templateUrl: './game-console-configuration-dialog.component.html',
  styleUrls: ['./game-console-configuration-dialog.component.sass'],
})
export class GameConsoleConfigurationDialogComponent implements OnInit {
  gameConsoleConfigurationForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public inputData: GameConsoleConfiguration | null,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<GameConsoleConfigurationDialogComponent>,
    private uiService: UiService
  ) {
    this.gameConsoleConfigurationForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      ipAddress: ['0.0.0.0', [Validators.required]],
      auroraFtpPort: [21, [Validators.required]],
      auroraFtpUsername: ['xboxftp', []],
      auroraFtpPassword: ['xboxftp', []],
      auroraHttpPort: [9999, [Validators.required]],
      auroraHttpUsername: ['xboxhttp', []],
      auroraHttpPassword: ['xboxhttp', []],
    });
  }

  ngOnInit(): void {
    if (this.inputData) {
      this.gameConsoleConfigurationForm = this.formBuilder.group({
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
    if (!this.gameConsoleConfigurationForm.valid) {
      return;
    }
    if (this.inputData) {
      // update console configuration
      this.uiService
        .updateGameConsoleConfiguration(
          this.inputData.id,
          this.gameConsoleConfigurationForm.value.name,
          this.gameConsoleConfigurationForm.value.ipAddress,
          this.gameConsoleConfigurationForm.value.auroraFtpPort,
          this.gameConsoleConfigurationForm.value.auroraFtpUsername,
          this.gameConsoleConfigurationForm.value.auroraFtpPassword,
          this.gameConsoleConfigurationForm.value.auroraHttpPort,
          this.gameConsoleConfigurationForm.value.auroraHttpUsername,
          this.gameConsoleConfigurationForm.value.auroraHttpPassword
        )
        .then((gameConsoleConfiguration) => {
          this.dialogRef.close(gameConsoleConfiguration);
        })
        .catch((err: any) => {
          console.error('Failed to create game console config:', err);
        });
    } else {
      // create console configuration
      this.uiService
        .createGameConsoleConfiguration(
          this.gameConsoleConfigurationForm.value.name,
          this.gameConsoleConfigurationForm.value.ipAddress,
          this.gameConsoleConfigurationForm.value.auroraFtpPort,
          this.gameConsoleConfigurationForm.value.auroraFtpUsername,
          this.gameConsoleConfigurationForm.value.auroraFtpPassword,
          this.gameConsoleConfigurationForm.value.auroraHttpPort,
          this.gameConsoleConfigurationForm.value.auroraHttpUsername,
          this.gameConsoleConfigurationForm.value.auroraHttpPassword
        )
        .then((gameConsoleConfiguration) => {
          this.dialogRef.close(gameConsoleConfiguration);
        })
        .catch((err: any) => {
          console.error('Failed to create game console config:', err);
        });
    }
  }
}
