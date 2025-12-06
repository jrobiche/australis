import { Routes } from '@angular/router';

import { gameConsoleConfigurationResolver } from '@app/shared/resolvers/game-console-configuration.resolver';

import { AuroraAssetManagerAppComponent } from './modules/aurora-asset-manager-app/aurora-asset-manager-app.component';
import { AuroraGameLibraryAppComponent } from './modules/aurora-game-library-app/aurora-game-library-app.component';
import { AuroraSystemInformationAppComponent } from './modules/aurora-system-information-app/aurora-system-information-app.component';
import { GameConsoleAppNavigationListComponent } from './components/game-console-app-navigation-list/game-console-app-navigation-list.component';
import { GameConsolePageComponent } from './components/game-console-page/game-console-page.component';

export const GAME_CONSOLE_ROUTES: Routes = [
  {
    path: ':consoleId',
    resolve: { gameConsoleConfiguration: gameConsoleConfigurationResolver },
    component: GameConsolePageComponent,
    children: [
      { path: '', component: GameConsoleAppNavigationListComponent },
      { path: 'assets', component: AuroraAssetManagerAppComponent },
      { path: 'games', component: AuroraGameLibraryAppComponent },
      {
        path: 'games/:gameId/assets',
        component: AuroraAssetManagerAppComponent,
      },
      { path: 'system', component: AuroraSystemInformationAppComponent },
    ],
  },
];
