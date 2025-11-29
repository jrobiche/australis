import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  Signal,
  ViewChild,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ROUTER_OUTLET_DATA } from '@angular/router';

import { AuroraStateService } from '@app/modules/aurora/services/aurora-state.service';
import { BreakpointService } from '@app/shared/services/breakpoint.service';
import { GameConsoleConfiguration, IntervalState } from '@app/shared/types/app';
import { PageTitleToolbarComponent } from '@app/shared/components/page-title-toolbar/page-title-toolbar.component';
import { DashlaunchViewComponent } from './components/dashlaunch-view/dashlaunch-view.component';
import { GameAchievementsViewComponent } from './components/game-achievements-view/game-achievements-view.component';
import { GameScreenshotsViewComponent } from './components/game-screenshots-view/game-screenshots-view.component';
import { NovaPluginViewComponent } from './components/nova-plugin-view/nova-plugin-view.component';
import { OverviewViewComponent } from './components/overview-view/overview-view.component';
import { ProfilesViewComponent } from './components/profiles-view/profiles-view.component';
import { ThreadsViewComponent } from './components/threads-view/threads-view.component';

@Component({
  selector: 'app-aurora-system-information-app',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    PageTitleToolbarComponent,
    DashlaunchViewComponent,
    GameAchievementsViewComponent,
    GameScreenshotsViewComponent,
    NovaPluginViewComponent,
    OverviewViewComponent,
    ProfilesViewComponent,
    ThreadsViewComponent,
  ],
  templateUrl: './aurora-system-information-app.component.html',
  styleUrl: './aurora-system-information-app.component.sass',
})
export class AuroraSystemInformationAppComponent implements OnDestroy, OnInit {
  readonly #auroraState = inject(AuroraStateService);
  readonly #snackBar = inject(MatSnackBar);
  readonly breakpoint = inject(BreakpointService);
  readonly gameConsoleConfiguration = inject(
    ROUTER_OUTLET_DATA,
  ) as Signal<GameConsoleConfiguration>;
  @ViewChild('detailsView')
  detailsView:
    | DashlaunchViewComponent
    | GameAchievementsViewComponent
    | GameScreenshotsViewComponent
    | NovaPluginViewComponent
    | OverviewViewComponent
    | ProfilesViewComponent
    | ThreadsViewComponent
    | null;
  @ViewChild('drawer')
  drawer: MatDrawer | null;
  intervalState: IntervalState;
  selectedView: string;
  viewListItems: { title: string; value: string }[];

  constructor() {
    this.detailsView = null;
    this.drawer = null;
    this.intervalState = {
      id: null,
      delay: 1000,
      consecutiveErrors: 0,
      consecutiveErrorsMax: 5,
    };
    this.viewListItems = [
      {
        title: 'Overview',
        value: 'overview',
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

  ngOnInit() {
    if (this.breakpoint.isWeb) {
      setTimeout(() => {
        this.drawer?.open();
      }, 250);
    }
    this.#startInterval();
  }

  get isIntervalRunning(): boolean {
    return this.intervalState.id != null;
  }

  onDetailsViewSelectionChange($event: any) {
    this.selectedView = $event.options[0].value;
    if (this.drawer && !this.breakpoint.isWeb) {
      this.drawer.close();
    }
  }

  onReconnectClick(): void {
    this.#startInterval();
  }

  #interval(scope: AuroraSystemInformationAppComponent): Promise<void> {
    // clear interval if not authenticated with game console
    if (
      scope.gameConsoleConfiguration == null ||
      !scope.#auroraState.isAuthenticated(scope.gameConsoleConfiguration())
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
      scope.#snackBar.open('Failed to communicate with console.', 'Close');
      return Promise.resolve();
    }
    // call `update()` on current "view" component
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
    let gameConsoleConfiguration = this.gameConsoleConfiguration();
    if (gameConsoleConfiguration == null) {
      return;
    }
    this.#auroraState.logout(gameConsoleConfiguration);
    this.#auroraState
      .login(gameConsoleConfiguration)
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
        this.#snackBar.open('Failed to connect to console.', 'Close', {
          duration: 3000,
        });
      });
  }

  #stopInterval(): void {
    if (this.intervalState.id != null) {
      clearInterval(this.intervalState.id);
      this.intervalState.id = null;
    }
  }
}
