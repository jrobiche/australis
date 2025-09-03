import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  Signal,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AuroraHttpService } from '@app/services/aurora-http.service';
import { GameConsoleConfiguration, IntervalState } from '@app/types/app';
import { AchievementsViewComponent } from './views/achievements-view/achievements-view.component';
import { DashboardViewComponent } from './views/dashboard-view/dashboard-view.component';
import { DashlaunchViewComponent } from './views/dashlaunch-view/dashlaunch-view.component';
import { PluginViewComponent } from './views/plugin-view/plugin-view.component';
import { ProfilesViewComponent } from './views/profiles-view/profiles-view.component';
import { ScreenshotsViewComponent } from './views/screenshots-view/screenshots-view.component';
import { ThreadsViewComponent } from './views/threads-view/threads-view.component';
import { UiService } from '@app/services/ui.service';

// TODO console data is saved in AuroraHttpService even after going back to consoles page

@Component({
  selector: 'app-system-details',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    AchievementsViewComponent,
    DashboardViewComponent,
    DashlaunchViewComponent,
    PluginViewComponent,
    ProfilesViewComponent,
    ScreenshotsViewComponent,
    ThreadsViewComponent,
  ],
  templateUrl: './system-details.component.html',
  styleUrl: './system-details.component.sass',
})
export class SystemDetailsComponent implements OnDestroy, OnInit {
  readonly #auroraHttpService = inject(AuroraHttpService);
  readonly #snackBar = inject(MatSnackBar);
  readonly uiService = inject(UiService);
  @ViewChild('drawer')
  drawer: MatDrawer | null;
  @ViewChild('detailsView')
  detailsView:
    | DashboardViewComponent
    | DashlaunchViewComponent
    | PluginViewComponent
    | ProfilesViewComponent
    | ScreenshotsViewComponent
    | ThreadsViewComponent
    | null;
  @Input({ required: true })
  gameConsoleConfiguration!: GameConsoleConfiguration;
  intervalState: IntervalState;
  selectedView: string;
  viewListItems: { title: string; value: string }[];

  constructor() {
    this.drawer = null;
    this.detailsView = null;
    this.intervalState = {
      id: null,
      delay: 1000,
      consecutiveErrors: 0,
      consecutiveErrorsMax: 5,
    };
    this.viewListItems = [
      {
        title: 'Overview',
        value: 'dashboard',
      },
      {
        title: 'DashLaunch',
        value: 'dashlaunch',
      },
      {
        title: 'Game Achievements',
        value: 'achievements',
      },
      {
        title: 'Game Screenshots',
        value: 'screenshots',
      },
      {
        title: 'Nova Plugin',
        value: 'plugin',
      },
      {
        title: 'Profiles',
        value: 'profiles',
      },
      {
        title: 'Threads',
        value: 'threads',
      },
    ];
    this.selectedView = this.viewListItems[0].value;
  }

  ngOnDestroy(): void {
    this.#stopInterval();
  }

  ngOnInit(): void {
    this.#auroraHttpService
      .login(this.gameConsoleConfiguration)
      .then((_) => {
        this.#startInterval();
      })
      .catch((error) => {
        console.error(
          'Failed to authenticate with console. Got the following error:',
          error,
        );
        this.#snackBar.open('Failed to connect to console.', '', {
          duration: 3000,
        });
      });
  }

  get isIntervalRunning(): boolean {
    return this.intervalState.id != null;
  }

  onDetailsSelectionChange($event: any) {
    this.selectedView = $event.options[0].value;
    if (this.drawer && !this.uiService.isWeb) {
      this.drawer.close();
    }
  }

  reconnect(): void {
    this.#startInterval();
  }

  #interval(scope: SystemDetailsComponent): Promise<void> {
    // clear interval if we have not authenticated with game console
    if (
      !scope.#auroraHttpService.isAuthenticated(scope.gameConsoleConfiguration)
    ) {
      scope.#stopInterval();
      return Promise.resolve();
    }
    // clear interval if there have been too many consecutive errors
    if (
      scope.intervalState.consecutiveErrors >=
      scope.intervalState.consecutiveErrorsMax
    ) {
      scope.#stopInterval();
      scope.#auroraHttpService.logout(scope.gameConsoleConfiguration);
      scope.#snackBar.open('Failed to communicate with console.', 'Close');
      return Promise.resolve();
    }
    // call `update()` on view component to load latest data from console
    if (scope.detailsView) {
      return scope.detailsView
        .update()
        .then((_) => {
          scope.intervalState.consecutiveErrors = 0;
          return Promise.resolve();
        })
        .catch((error) => {
          console.error(
            'Failed to update system detail view. Got the following error:',
            error,
          );
          scope.intervalState.consecutiveErrors += 1;
          return Promise.resolve();
        });
    } else {
      return Promise.resolve();
    }
  }

  #startInterval(): void {
    this.#auroraHttpService
      .login(this.gameConsoleConfiguration)
      .then((_) => {
        this.#stopInterval();
        this.intervalState.id = setInterval(
          this.#interval,
          this.intervalState.delay,
          this,
        );
      })
      .catch((error) => {
        this.#stopInterval();
        console.error(
          'Failed to authenticate with console. Got the following error:',
          error,
        );
        this.#snackBar.open('Failed to connect to console.', '', {
          duration: 3000,
        });
      });
  }

  #stopInterval(): void {
    if (this.intervalState.id !== null) {
      clearInterval(this.intervalState.id);
      this.intervalState.id = null;
    }
  }
}
