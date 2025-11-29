import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResolveFn } from '@angular/router';

import { GameConsoleConfiguration } from '@app/shared/types/app';
import { GameConsoleConfigurationStoreService } from '@app/shared/services/game-console-configuration-store.service';

export const gameConsoleConfigurationResolver: ResolveFn<
  GameConsoleConfiguration | null
> = (route, state) => {
  const gameConsoleConfigurationStore = inject(
    GameConsoleConfigurationStoreService,
  );
  const snackBar = inject(MatSnackBar);
  const id = route.paramMap.get('consoleId');
  return gameConsoleConfigurationStore.read(id).catch((error) => {
    console.error(
      `Failed to resolve game console configuration with id: '${id}'. Got the following error:`,
      error,
    );
    snackBar.open('Failed to load game console configuration.', '', {
      duration: 3000,
    });
    return null;
  });
};
