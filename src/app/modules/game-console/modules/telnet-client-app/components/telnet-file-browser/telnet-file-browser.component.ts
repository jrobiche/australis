import { AsyncPipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TelnetService } from '@app/modules/telnet/services/telnet.service';
import {
  DirlistEntry,
  Drivefreespace,
  DrivelistEntry,
} from '@app/modules/telnet/types/telnet';
import { PageTitleToolbarComponent } from '@app/shared/components/page-title-toolbar/page-title-toolbar.component';
import { ResponsiveWidthContainerComponent } from '@app/shared/components/responsive-width-container/responsive-width-container.component';
import { BreakpointService } from '@app/shared/services/breakpoint.service';
import {
  ConfirmationDialogData,
  GameConsoleConfiguration,
} from '@app/shared/types/app';
import { DialogService } from '@app/shared/services/dialog.service';

type DrivelistAndFreespaceEntry = {
  drivelistEntry: DrivelistEntry;
  drivefreespace: Drivefreespace | null;
};

@Component({
  selector: 'app-telnet-file-browser',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    PageTitleToolbarComponent,
    ResponsiveWidthContainerComponent,
  ],
  templateUrl: './telnet-file-browser.component.html',
  styleUrl: './telnet-file-browser.component.sass',
})
export class TelnetFileBrowserComponent implements OnInit {
  readonly #dialogService = inject(DialogService);
  readonly #snackBar = inject(MatSnackBar);
  readonly #telnet = inject(TelnetService);
  readonly breakpoint = inject(BreakpointService);
  @Input({ required: true })
  gameConsoleConfiguration!: GameConsoleConfiguration;
  cwd: string[];
  dirlistEntries: DirlistEntry[];
  drivelistAndFreespaceEntries: DrivelistAndFreespaceEntry[];
  errorMsg: string;
  isLoading: boolean;

  constructor() {
    this.cwd = [];
    this.dirlistEntries = [];
    this.drivelistAndFreespaceEntries = [];
    this.errorMsg = '';
    this.isLoading = false;
  }

  ngOnInit(): void {
    this.cwd = [];
    this.#updateEntryLists(this.cwd);
  }

  get isRefreshDisabled(): boolean {
    return this.isLoading;
  }

  driveSizeText(drivefreespace: Drivefreespace | null): string {
    if (drivefreespace === null) {
      return 'Unknown';
    }
    let totalValue =
      drivefreespace.totalbyteshi * Math.pow(2, 32) +
      drivefreespace.totalbyteslo;
    let freeValue =
      drivefreespace.totalfreebyteshi * Math.pow(2, 32) +
      drivefreespace.totalfreebyteslo;
    let usedValue = totalValue - freeValue;
    return `${this.#fileSizeSI(usedValue)}/${this.#fileSizeSI(totalValue)} (${this.#fileSizeSI(
      freeValue,
    )} free)`;
  }

  fileSizeText(entry: DirlistEntry): string {
    let value = entry.sizehi * Math.pow(2, 32) + entry.sizelo;
    return this.#fileSizeSI(value);
  }

  isExecutable(entry: DirlistEntry): boolean {
    const name = entry.name.toLowerCase();
    return ['.xex', '.xbe', '.exe'].some((x) => name.endsWith(x));
  }

  onAncestorEntryClick(entryIndex: number) {
    this.cwd = this.cwd.slice(0, entryIndex + 1);
    this.#updateEntryLists(this.cwd);
  }

  onDirlistEntryClick(entry: DirlistEntry) {
    if (entry.directory) {
      this.cwd.push(entry.name);
      this.#updateEntryLists(this.cwd);
    } else if (this.isExecutable(entry)) {
      this.#launchEntry(this.cwd, entry);
    }
  }

  onDrivelistEntryClick(entry: DrivelistEntry) {
    this.cwd = [entry.drivename];
    this.#updateEntryLists(this.cwd);
  }

  onLauncherClick() {
    let dialogData: ConfirmationDialogData = {
      title: 'Launcher',
      bodyParagraphs: ['Return to Launcher?'],
      confirmButtonText: 'Yes',
    };
    this.#dialogService
      .openConfirmationDialog(dialogData)
      .subscribe((result) => {
        if (result) {
          this.#telnet
            .magicboot(this.gameConsoleConfiguration)
            .catch((error) => {
              console.error(
                'Failed to return to launcher. Got the following error:',
                error,
              );
              this.#snackBar.open('Failed to return to launcher.', 'Close', {
                duration: 3000,
              });
            });
        }
      });
  }

  onParentDirClick() {
    this.cwd.pop();
    this.#updateEntryLists(this.cwd);
  }

  onRefreshClick() {
    this.#updateEntryLists(this.cwd);
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

  #compareDrivelistEntries(a: DrivelistEntry, b: DrivelistEntry): number {
    // sort by name (case insensitive)
    const nameA = a.drivename.toUpperCase();
    const nameB = b.drivename.toUpperCase();
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
      .catch((error) => {
        console.error(
          'Failed to launch executable. Got the following error:',
          error,
        );
        this.#snackBar.open('Failed to launch executable.', 'Close');
      });
  }

  #updateDirlistEntries(path: string[]): Promise<void> {
    this.dirlistEntries = [];
    return this.#telnet
      .dirlist(this.gameConsoleConfiguration, path)
      .then((resp) => {
        this.dirlistEntries = resp.sort(this.#compareDirlistEntries);
      })
      .catch((error) => {
        console.error('Failed to get dirlist. Got the following error:', error);
        this.dirlistEntries = [];
        this.errorMsg = `There was an error loading directory content. ${error}`;
      });
  }

  #updateDrivelistAndFreespaceEntries(): Promise<void> {
    this.drivelistAndFreespaceEntries = [];
    return this.#telnet
      .drivelist(this.gameConsoleConfiguration)
      .then((drivelist) => {
        drivelist
          .sort(this.#compareDrivelistEntries)
          .forEach((drivelistEntry) => {
            this.drivelistAndFreespaceEntries.push({
              drivelistEntry: drivelistEntry,
              drivefreespace: null,
            });
          });
      })
      .then(() => {
        this.drivelistAndFreespaceEntries.forEach((entry, index) => {
          // use a timeout to add a delay between calls
          setTimeout(() => {
            this.#telnet
              .drivefreespace(
                this.gameConsoleConfiguration,
                `${entry.drivelistEntry.drivename}:\\`,
              )
              .then((drivefreespace) => {
                entry.drivefreespace = drivefreespace;
              })
              .catch((error) => {
                entry.drivefreespace = null;
                console.warn(
                  `Failed to get drivefreespace for ${
                    entry.drivelistEntry.drivename
                  }. Got the following error:`,
                  error,
                );
              });
          }, index * 60);
        });
      })
      .catch((error) => {
        console.error(
          'Failed to get drivelist. Got the following error:',
          error,
        );
        this.drivelistAndFreespaceEntries = [];
        this.errorMsg = `There was an error loading drive list. ${error}`;
      });
  }

  #updateEntryLists(path: string[]): void {
    this.drivelistAndFreespaceEntries = [];
    this.dirlistEntries = [];
    this.errorMsg = '';
    this.isLoading = true;
    if (path.length == 0) {
      this.#updateDrivelistAndFreespaceEntries().finally(() => {
        this.isLoading = false;
      });
    } else {
      this.#updateDirlistEntries(path).finally(() => {
        this.isLoading = false;
      });
    }
  }
}
