import { Injectable, inject } from '@angular/core';

import { GameConsoleConfiguration } from '@app/types/app';
import { TauriService } from '@app/services/tauri.service';

@Injectable({
  providedIn: 'root',
})
export class GameConsoleConfigurationService {
  readonly #tauriService = inject(TauriService);

  constructor() {}

  create(
    gameConsoleConfiguration: GameConsoleConfiguration,
  ): Promise<GameConsoleConfiguration> {
    return this.#tauriService.gameConsoleConfigurationCreate(
      gameConsoleConfiguration,
    );
  }

  delete(id: string): Promise<void> {
    return this.#tauriService.gameConsoleConfigurationDelete(id);
  }

  read(id: string): Promise<GameConsoleConfiguration> {
    return this.#tauriService.gameConsoleConfigurationRead(id);
  }

  readAll(): Promise<GameConsoleConfiguration[]> {
    return this.#tauriService.gameConsoleConfigurationReadAll();
  }

  update(
    id: string,
    consoleConfig: GameConsoleConfiguration,
  ): Promise<GameConsoleConfiguration> {
    return this.#tauriService.gameConsoleConfigurationUpdate(id, consoleConfig);
  }
}
