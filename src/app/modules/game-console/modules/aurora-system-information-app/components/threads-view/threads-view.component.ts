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
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';

import { AuroraStateService } from '@app/modules/aurora/services/aurora-state.service';
import {
  AuroraThread,
  AuroraThreadState,
} from '@app/modules/aurora/types/aurora';
import { PageTitleToolbarComponent } from '@app/shared/components/page-title-toolbar/page-title-toolbar.component';
import { ResponsiveWidthContainerComponent } from '@app/shared/components/responsive-width-container/responsive-width-container.component';
import { BreakpointService } from '@app/shared/services/breakpoint.service';
import { GameConsoleConfiguration } from '@app/shared/types/app';

@Component({
  selector: 'app-threads-view',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatTableModule,
    PageTitleToolbarComponent,
    ResponsiveWidthContainerComponent,
  ],
  templateUrl: './threads-view.component.html',
  styleUrl: './threads-view.component.sass',
})
export class ThreadsViewComponent implements OnInit {
  readonly #auroraState = inject(AuroraStateService);
  readonly #snackBar = inject(MatSnackBar);
  readonly breakpoint = inject(BreakpointService);
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
    this.threads = this.#auroraState.threads(this.gameConsoleConfiguration);
    this.threadState = this.#auroraState.threadState(
      this.gameConsoleConfiguration,
    );
  }

  get isResumeThreadsDisabled(): boolean {
    return !this.#auroraState.isAuthenticated(this.gameConsoleConfiguration);
  }

  get isSuspendThreadsDisabled(): boolean {
    return !this.#auroraState.isAuthenticated(this.gameConsoleConfiguration);
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
    this.#auroraState
      .resumeThreads(this.gameConsoleConfiguration)
      .catch((error) => {
        console.error(
          'Failed to resume threads. Got the following error:',
          error,
        );
        this.#snackBar.open('Failed to resume threads.', 'Close');
      });
  }

  onSuspendThreads(): void {
    this.#auroraState
      .suspendThreads(this.gameConsoleConfiguration)
      .catch((error) => {
        console.error(
          'Failed to suspend threads. Got the following error:',
          error,
        );
        this.#snackBar.open('Failed to suspend threads.', 'Close');
      });
  }

  // called by parent component
  async update(): Promise<void> {
    if (this.gameConsoleConfiguration) {
      await this.#auroraState.loadThreadState(this.gameConsoleConfiguration);
      await this.#auroraState.loadThreads(this.gameConsoleConfiguration);
    }
    return Promise.resolve();
  }
}
