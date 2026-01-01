import { AsyncPipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';

import { PageTitleToolbarComponent } from '@app/shared/components/page-title-toolbar/page-title-toolbar.component';
import { BreakpointService } from '@app/shared/services/breakpoint.service';
import { TelnetService } from '@app/modules/telnet/services/telnet.service';
import { GameConsoleConfiguration } from '@app/shared/types/app';

// TODO move somewhere else
export interface MemoryEntry {
  address: string;
  hex: string;
  ascii: string;
}

@Component({
  selector: 'app-telnet-memory-editor',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    PageTitleToolbarComponent,
  ],
  templateUrl: './telnet-memory-editor.component.html',
  styleUrl: './telnet-memory-editor.component.sass',
})
export class TelnetMemoryEditorComponent {
  readonly #snackBar = inject(MatSnackBar);
  readonly #telnet = inject(TelnetService);
  readonly breakpoint = inject(BreakpointService);
  @Input({ required: true })
  gameConsoleConfiguration!: GameConsoleConfiguration;
  dataAddress: number;
  dataLength: number;
  rowLength: number;
  dataSource: MemoryEntry[];
  displayedColumns: string[];

  constructor() {
    this.dataAddress = 0x83084750;
    this.dataLength = 4096;
    this.rowLength = 16;
    this.dataSource = [];
    this.displayedColumns = ['memory-address', 'memory-hex', 'memory-ascii'];
  }

  rowAddressText(rowIndex: number, startAddress: number): string {
    return '0x' + (16 * rowIndex + startAddress).toString(16).toUpperCase();
  }

  rowHexText(rowIndex: number, rowLength: number, data: number[]): string {
    let startIndex = rowIndex * this.rowLength;
    return data
      .slice(startIndex, startIndex + rowLength)
      .map((value) => value.toString(16).padStart(2, '0').toUpperCase())
      .join(' ');
  }

  rowAsciiText(rowIndex: number, rowLength: number, data: number[]): string {
    let startIndex = rowIndex * rowLength;
    let s = '';
    return data
      .slice(startIndex, startIndex + rowLength)
      .map((value) => {
        if (value > 20 && value < 127) {
          // return String.fromCodePoint(value);
          return String.fromCharCode(value);
        }
        if (value == 20) {
          return ' ';
        }
        return '.';
      })
      .join('');
  }

  onResumeClick(): void {
    this.#telnet
      .go(this.gameConsoleConfiguration)
      .then((resp) => {
        console.log('Go Resp:', resp);
      })
      .catch((error) => {
        // TODO
        console.error(
          'Failed to get drivelist. Got the following error:',
          error,
        );
        this.#snackBar.open('Failed to communicate with console.', 'Close');
      });
  }

  onSuspendClick(): void {
    this.#telnet
      .stop(this.gameConsoleConfiguration)
      .then((resp) => {
        console.log('Stop Resp:', resp);
      })
      .catch((error) => {
        // TODO
        console.error(
          'Failed to get drivelist. Got the following error:',
          error,
        );
        this.#snackBar.open('Failed to communicate with console.', 'Close');
      });
  }

  onGetmemClick(): void {
    let dataAddress = this.dataAddress;
    let rowLength = this.rowLength;
    this.#telnet
      .getmem(this.gameConsoleConfiguration, dataAddress, this.dataLength)
      .then((data) => {
        this.dataSource = [];

        let rowCount = Math.ceil(data.length / rowLength);
        let rowIndicies = Array.from(Array(rowCount).keys());

        for (let rowIndex of rowIndicies) {
          this.dataSource.push({
            address: this.rowAddressText(rowIndex, dataAddress),
            hex: this.rowHexText(rowIndex, rowLength, data),
            ascii: this.rowAsciiText(rowIndex, rowLength, data),
          });
        }
      })
      .catch((error) => {
        console.error(
          'Failed to get drivelist. Got the following error:',
          error,
        );
        this.#snackBar.open('Failed to communicate with console.', 'Close');
      });
  }
}
