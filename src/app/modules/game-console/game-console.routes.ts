import { Routes } from '@angular/router';

import { gameConsoleConfigurationResolver } from '@app/shared/resolvers/game-console-configuration.resolver';

import { AuroraAssetManagerAppComponent } from './modules/aurora-asset-manager-app/aurora-asset-manager-app.component';
import { AuroraGameLibraryAppComponent } from './modules/aurora-game-library-app/aurora-game-library-app.component';
import { AuroraSystemInformationAppComponent } from './modules/aurora-system-information-app/aurora-system-information-app.component';
import { TelnetClientAppComponent } from './modules/telnet-client-app/telnet-client-app.component';
import { GameConsoleAppNavigationComponent } from './components/game-console-app-navigation/game-console-app-navigation.component';
import { GameConsolePageComponent } from './components/game-console-page/game-console-page.component';

export const GAME_CONSOLE_ROUTES: Routes = [
  {
    path: ':consoleId',
    resolve: { gameConsoleConfiguration: gameConsoleConfigurationResolver },
    component: GameConsolePageComponent,
    children: [
      { path: '', component: GameConsoleAppNavigationComponent },
      { path: 'assets', component: AuroraAssetManagerAppComponent },
      { path: 'games', component: AuroraGameLibraryAppComponent },
      {
        path: 'games/:gameId/assets',
        component: AuroraAssetManagerAppComponent,
      },
      { path: 'system', component: AuroraSystemInformationAppComponent },
      { path: 'telnet', component: TelnetClientAppComponent },
    ],
  },
];
