import { AsyncPipe } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PageTitleToolbarComponent } from '@app/shared/components/page-title-toolbar/page-title-toolbar.component';
import { BreakpointService } from '@app/shared/services/breakpoint.service';
import { TelnetService } from '@app/modules/telnet/services/telnet.service';
import { DirlistEntry } from '@app/modules/telnet/types/telnet';
import { GameConsoleConfiguration } from '@app/shared/types/app';

@Component({
  selector: 'app-telnet-file-browser',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    PageTitleToolbarComponent,
  ],
  templateUrl: './telnet-file-browser.component.html',
  styleUrl: './telnet-file-browser.component.sass',
})
export class TelnetFileBrowserComponent implements OnInit {
  readonly #snackBar = inject(MatSnackBar);
  readonly #telnet = inject(TelnetService);
  readonly breakpoint = inject(BreakpointService);
  @Input({ required: true })
  gameConsoleConfiguration!: GameConsoleConfiguration;
  cwd: string[];
  dirlistEntries: DirlistEntry[];
  drivelistEntries: string[];
  fileListError: boolean;
  fileListErrorMsg: string;

  constructor() {
    this.cwd = [];
    this.dirlistEntries = [];
    this.drivelistEntries = [];
    this.fileListError = false;
    this.fileListErrorMsg = '';
  }

  ngOnInit(): void {
    this.cwd = [];
    this.#updatePathEntries(this.cwd);
  }

  get cwdString(): string {
    let result = '';
    if (this.cwd.length == 0) {
      result = 'No path selected.';
    } else {
      result = `${this.cwd[0]}:\\` + this.cwd.slice(1).join('\\');
    }
    return result;
  }

  isExecutable(entry: DirlistEntry): boolean {
    const name = entry.name.toLowerCase();
    return name.endsWith('.xex') || name.endsWith('.xbe');
  }

  launchEntry(cwd: string[], entry: DirlistEntry) {
    this.#telnet
      .magicboot(this.gameConsoleConfiguration, [...this.cwd, entry.name])
      .then((resp) => {
        if (resp.status.code != 200) {
          console.warn(
            'Expected a response with a status code of 200 but got the following response:',
            resp,
          );
          this.#snackBar.open('Possible error launching executable.', 'Close');
        }
      })
      .catch((error) => {
        console.error(
          'Failed to launch executable. Got the following error:',
          error,
        );
        this.#snackBar.open('Failed to launch executable.', 'Close');
      });
  }

  onDirlistEntryClick(entry: DirlistEntry) {
    if (entry.directory) {
      this.cwd.push(entry.name);
      this.#updatePathEntries(this.cwd);
    } else if (this.isExecutable(entry)) {
      this.launchEntry(this.cwd, entry);
    }
  }

  onDrivelistEntryClick(entry: string) {
    this.cwd = [entry];
    this.#updatePathEntries(this.cwd);
  }

  onPopDirClick() {
    this.cwd.pop();
    this.#updatePathEntries(this.cwd);
  }

  onRefreshEntriesClick() {
    this.#updatePathEntries(this.cwd);
  }

  sizeText(entry: DirlistEntry): string {
    let hi = entry.sizehi & 0xffffffff;
    let lo = entry.sizelo & 0xffffffff;
    let value = (hi << 32) | lo;
    return this.#fileSizeSI(value);
  }

  #compareDirlistEntries(a: DirlistEntry, b: DirlistEntry): number {
    // sort directories first
    const isDirA = a.directory;
    const isDirB = b.directory;
    if (isDirA && !isDirB) {
      return -1;
    }
    if (!isDirA && isDirB) {
      return 1;
    }

    // sort by name (case insensitive)
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    return 0;
  }

  #fileSizeSI(bytes: number): string {
    const exponent = Math.floor(
      Math.max(Math.log(bytes), 0.1) / Math.log(1000.0),
    );
    const decimal = (bytes / Math.pow(1000.0, exponent)).toFixed(
      exponent ? 2 : 0,
    );
    return `${decimal} ${exponent ? `${'kMGTPEZY'[exponent - 1]}B` : 'B'}`;
  }

  #updatePathEntries(path: string[]): void {
    this.dirlistEntries = [];
    this.drivelistEntries = [];
    this.fileListError = false;
    if (path.length == 0) {
      this.#telnet
        .drivelist(this.gameConsoleConfiguration)
        .then((resp) => {
          this.drivelistEntries = resp.sort();
        })
        .catch((error) => {
          console.error(
            'Failed to get drivelist. Got the following error:',
            error,
          );
          this.fileListError = true;
          this.fileListErrorMsg = `There was an error loading drive list. ${error}`;
        });
    } else {
      this.#telnet
        .dirlist(this.gameConsoleConfiguration, path)
        .then((resp) => {
          this.dirlistEntries = resp.sort(this.#compareDirlistEntries);
        })
        .catch((error) => {
          console.error(
            'Failed to get dirlist. Got the following error:',
            error,
          );
          this.fileListError = true;
          this.fileListErrorMsg = `There was an error loading directory content. ${error}`;
        });
    }
  }
}
