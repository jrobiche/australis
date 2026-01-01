import { AsyncPipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';

import { PageTitleToolbarComponent } from '@app/shared/components/page-title-toolbar/page-title-toolbar.component';
import { ResponsiveWidthContainerComponent } from '@app/shared/components/responsive-width-container/responsive-width-container.component';
import { BreakpointService } from '@app/shared/services/breakpoint.service';
import { TelnetService } from '@app/modules/telnet/services/telnet.service';
import { GameConsoleConfiguration } from '@app/shared/types/app';

export interface MemoryEntry {
  isEditing: boolean;
  address: string;
  hex: string;
  ascii: string;
}

@Component({
  selector: 'app-telnet-memory-editor',
  imports: [
    AsyncPipe,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    ReactiveFormsModule,
    PageTitleToolbarComponent,
    ResponsiveWidthContainerComponent,
  ],
  templateUrl: './telnet-memory-editor.component.html',
  styleUrl: './telnet-memory-editor.component.sass',
})
export class TelnetMemoryEditorComponent {
  readonly #formBuilder = inject(FormBuilder);
  readonly #snackBar = inject(MatSnackBar);
  readonly #telnet = inject(TelnetService);
  readonly breakpoint = inject(BreakpointService);
  @Input({ required: true })
  gameConsoleConfiguration!: GameConsoleConfiguration;
  rowLength: number;
  dataSource: MemoryEntry[];
  displayedColumns: string[];
  inputForm: FormGroup;

  constructor() {
    this.rowLength = 16;
    this.dataSource = [];
    this.displayedColumns = [
      'memory-actions',
      'memory-address',
      'memory-hex',
      'memory-ascii',
    ];
    this.inputForm = this.#formBuilder.group({
      address: ['0x82000000', [Validators.required]],
      length: ['0x1000', [Validators.required]],
    });
  }

  rowAddressText(rowIndex: number, startAddress: number): string {
    return '0x' + (16 * rowIndex + startAddress).toString(16).toUpperCase();
  }

  rowHexText(rowIndex: number, rowLength: number, data: number[]): string {
    let startIndex = rowIndex * rowLength;
    return data
      .slice(startIndex, startIndex + rowLength)
      .map((value) => value.toString(16).padStart(2, '0').toUpperCase())
      .join(' ');
  }

  rowAsciiText(rowIndex: number, rowLength: number, data: number[]): string {
    let startIndex = rowIndex * rowLength;
    return data
      .slice(startIndex, startIndex + rowLength)
      .map((value) => {
        if (value >= 32 && value < 127) {
          return String.fromCharCode(value);
        }
        return '.';
      })
      .join('');
  }

  onEditApplyClick(entry: MemoryEntry, value: string): void {
    // TODO verify length of value (minus whitespace) is <= 32
    let address: number = Number(entry.address);
    value = value.replaceAll(/\s/g, '');
    this.#telnet
      .setmem(this.gameConsoleConfiguration, address, value)
      .then(() => {
        this.onSubmitClick();
      })
      .catch((error) => {
        console.error(
          'Failed to run setmem command. Got the following error:',
          error,
        );
        this.#snackBar.open('Failed to communicate with console.', 'Close');
      });
  }

  onEditCancelClick(entry: MemoryEntry): void {
    entry.isEditing = false;
  }

  onEditToggleClick(entry: MemoryEntry): void {
    entry.isEditing = !entry.isEditing;
  }

  onResumeClick(): void {
    this.#telnet.go(this.gameConsoleConfiguration).catch((error) => {
      console.error(
        'Failed to get resume console. Got the following error:',
        error,
      );
      this.#snackBar.open('Failed to communicate with console.', 'Close');
    });
  }

  onSuspendClick(): void {
    this.#telnet.stop(this.gameConsoleConfiguration).catch((error) => {
      console.error(
        'Failed to get suspend console. Got the following error:',
        error,
      );
      this.#snackBar.open('Failed to communicate with console.', 'Close');
    });
  }

  onSubmitClick(): void {
    if (this.inputForm.valid) {
      let dataAddress = Number(this.inputForm.value.address);
      let dataLength = Number(this.inputForm.value.length);
      this.#telnet
        .getmem(this.gameConsoleConfiguration, dataAddress, dataLength)
        .then((data) => {
          this.dataSource = [];

          let rowCount = Math.ceil(data.length / this.rowLength);
          let rowIndicies = Array.from(Array(rowCount).keys());

          for (let rowIndex of rowIndicies) {
            this.dataSource.push({
              isEditing: false,
              address: this.rowAddressText(rowIndex, dataAddress),
              hex: this.rowHexText(rowIndex, this.rowLength, data),
              ascii: this.rowAsciiText(rowIndex, this.rowLength, data),
            });
          }
        })
        .catch((error) => {
          console.error(
            'Failed to call getmem. Got the following error:',
            error,
          );
          this.#snackBar.open('Failed to communicate with console.', 'Close');
        });
    }
  }
}
