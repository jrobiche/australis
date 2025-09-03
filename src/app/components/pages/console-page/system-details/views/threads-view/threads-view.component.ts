import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  Signal,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';

import { AuroraThread, AuroraThreadState } from '@app/types/aurora';
import { AuroraHttpService } from '@app/services/aurora-http.service';
import { GameConsoleConfiguration } from '@app/types/app';
import { UiService } from '@app/services/ui.service';

@Component({
  selector: 'app-threads-view',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatTableModule,
  ],
  templateUrl: './threads-view.component.html',
  styleUrl: './threads-view.component.sass',
})
export class ThreadsViewComponent implements OnInit {
  readonly #auroraHttpService = inject(AuroraHttpService);
  readonly #snackBar = inject(MatSnackBar);
  readonly uiService = inject(UiService);
  @Input({ required: true })
  gameConsoleConfiguration!: GameConsoleConfiguration;
  displayedColumns: string[];
  threads: Signal<AuroraThread[]>;
  threadState: Signal<AuroraThreadState | null>;

  constructor() {
    this.displayedColumns = [
      'id',
      'address',
      'state',
      'type',
      'priority',
      'flags',
    ];
    this.threads = signal<AuroraThread[]>([]);
    this.threadState = signal<AuroraThreadState | null>(null);
  }

  ngOnInit() {
    this.threads = this.#auroraHttpService.threads(
      this.gameConsoleConfiguration,
    );
    this.threadState = this.#auroraHttpService.threadState(
      this.gameConsoleConfiguration,
    );
    // TODO load threads and thread state?
  }

  get isResumeThreadsDisabled(): boolean {
    return !this.#auroraHttpService.isAuthenticated(
      this.gameConsoleConfiguration,
    );
  }

  get isSuspendThreadsDisabled(): boolean {
    return !this.#auroraHttpService.isAuthenticated(
      this.gameConsoleConfiguration,
    );
  }

  get threadStateText(): string {
    switch (this.threadState()?.state) {
      case 0:
        return 'Active';
      case 2:
        return 'Suspended';
      default:
        return 'Unknown';
    }
  }

  onResumeThreads(): void {
    this.#auroraHttpService
      .resumeThreads(this.gameConsoleConfiguration)
      .catch((error) => {
        console.error(
          'Failed to resume threads. Got the following error:',
          error,
        );
        this.#snackBar.open('Failed to resume threads', 'Close');
      });
  }

  onSuspendThreads(): void {
    this.#auroraHttpService
      .suspendThreads(this.gameConsoleConfiguration)
      .catch((error) => {
        console.error(
          'Failed to suspend threads. Got the following error:',
          error,
        );
        this.#snackBar.open('Failed to suspend threads', 'Close');
      });
  }

  // called by parent component
  async update(): Promise<void> {
    if (this.gameConsoleConfiguration) {
      await this.#auroraHttpService.loadThreadState(
        this.gameConsoleConfiguration,
      );
      await this.#auroraHttpService.loadThreads(this.gameConsoleConfiguration);
    }
    return Promise.resolve();
  }
}
