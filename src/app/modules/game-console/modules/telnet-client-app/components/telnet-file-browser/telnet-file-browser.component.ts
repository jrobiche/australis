import { AsyncPipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TelnetService } from '@app/modules/telnet/services/telnet.service';
import { DirlistEntry } from '@app/modules/telnet/types/telnet';
import { PageTitleToolbarComponent } from '@app/shared/components/page-title-toolbar/page-title-toolbar.component';
import { BreakpointService } from '@app/shared/services/breakpoint.service';
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
  driveFreeSpaces: any;

  constructor() {
    this.cwd = [];
    this.dirlistEntries = [];
    this.drivelistEntries = [];
    this.fileListError = false;
    this.fileListErrorMsg = '';
    this.driveFreeSpaces = {};
  }

  ngOnInit(): void {
    this.cwd = [];
    this.#updatePathEntries(this.cwd);
  }

  driveSizeText(driveName: string): string {
    if (Object.hasOwn(this.driveFreeSpaces, driveName)) {
      let data = this.driveFreeSpaces[driveName];
      let totalValue = data.totalbyteshi * Math.pow(2, 32) + data.totalbyteslo;
      let freeValue =
        data.totalfreebyteshi * Math.pow(2, 32) + data.totalfreebyteslo;
      return `${this.#fileSizeSI(totalValue)} (${this.#fileSizeSI(freeValue)} free)`;
    }
    return 'Unknown';
  }

  fileSizeText(entry: DirlistEntry): string {
    let value = entry.sizehi * Math.pow(2, 32) + entry.sizelo;
    return this.#fileSizeSI(value);
  }

  isExecutable(entry: DirlistEntry): boolean {
    const name = entry.name.toLowerCase();
    return (
      name.endsWith('.xex') || name.endsWith('.xbe') || name.endsWith('.exe')
    );
  }

  onAncestorEntryClick(entryIndex: number) {
    let newCwd = this.cwd.slice(0, entryIndex + 1);
    this.cwd = newCwd;
    this.#updatePathEntries(this.cwd);
  }

  onDirlistEntryClick(entry: DirlistEntry) {
    if (entry.directory) {
      this.cwd.push(entry.name);
      this.#updatePathEntries(this.cwd);
    } else if (this.isExecutable(entry)) {
      this.#launchEntry(this.cwd, entry);
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

  onReturnToLauncherClick() {
    this.#telnet
      .magicboot(this.gameConsoleConfiguration)
      .then((response) => {
        // TODO
        console.log('RESPONSE:', response);
      })
      .catch((error) => {
        // TODO
        console.error('ERROR:', error);
      });
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

  #launchEntry(cwd: string[], entry: DirlistEntry) {
    this.#telnet
      .magicboot_path(this.gameConsoleConfiguration, [...this.cwd, entry.name])
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

  #updateDriveSizes(driveListEntries: string[]): void {
    driveListEntries.forEach((driveName) => {
      if (!Object.hasOwn(this.driveFreeSpaces, driveName)) {
        this.#telnet
          .drivefreespace(this.gameConsoleConfiguration, `${driveName}:\\`)
          .then((response) => {
            this.driveFreeSpaces[driveName] = response;
          })
          .catch((error) => {
            // TODO error
            this.driveFreeSpaces[driveName] = null;
            console.error('ERROR:', error);
          });
      }
    });
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
          this.#updateDriveSizes(this.drivelistEntries);
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
