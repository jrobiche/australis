import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';

import { GameConsoleConfiguration } from '@app/shared/types/app';

@Injectable({
  providedIn: 'root',
})
export class GameConsoleConfigurationStoreService {
  constructor() {}

  create(
    gameConsoleConfiguration: Omit<GameConsoleConfiguration, 'id'>,
  ): Promise<GameConsoleConfiguration> {
    return invoke('game_console_configuration_create', {
      name: gameConsoleConfiguration.name,
      ipAddress: gameConsoleConfiguration.ipAddress,
      auroraFtpPort: gameConsoleConfiguration.auroraFtpPort,
      auroraFtpUsername: gameConsoleConfiguration.auroraFtpUsername,
      auroraFtpPassword: gameConsoleConfiguration.auroraFtpPassword,
      auroraHttpPort: gameConsoleConfiguration.auroraHttpPort,
      auroraHttpUsername: gameConsoleConfiguration.auroraHttpUsername,
      auroraHttpPassword: gameConsoleConfiguration.auroraHttpPassword,
    });
  }

  delete(id: string): Promise<void> {
    return invoke('game_console_configuration_delete', {
      consoleConfigurationId: id,
    });
  }

  read(id: string | null): Promise<GameConsoleConfiguration> {
    return invoke('game_console_configuration_read', {
      consoleConfigurationId: id,
    });
  }

  readAll(): Promise<GameConsoleConfiguration[]> {
    return invoke('game_console_configuration_read_all');
  }

  readAllSorted(): Promise<GameConsoleConfiguration[]> {
    return this.readAll().then((configs) => {
      return this.sort(configs);
    });
  }

  sort(
    gameConsoleConfigurations: GameConsoleConfiguration[],
  ): GameConsoleConfiguration[] {
    return gameConsoleConfigurations.sort(
      this.#compareGameConsoleConfigurations,
    );
  }

  update(
    id: string,
    consoleConfig: Omit<GameConsoleConfiguration, 'id'>,
  ): Promise<GameConsoleConfiguration> {
    return invoke('game_console_configuration_update', {
      id: id,
      name: consoleConfig.name,
      ipAddress: consoleConfig.ipAddress,
      auroraFtpPort: consoleConfig.auroraFtpPort,
      auroraFtpUsername: consoleConfig.auroraFtpUsername,
      auroraFtpPassword: consoleConfig.auroraFtpPassword,
      auroraHttpPort: consoleConfig.auroraHttpPort,
      auroraHttpUsername: consoleConfig.auroraHttpUsername,
      auroraHttpPassword: consoleConfig.auroraHttpPassword,
    });
  }

  #compareGameConsoleConfigurations(
    a: GameConsoleConfiguration,
    b: GameConsoleConfiguration,
  ) {
    // compare names
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names are the same, compare ids
    const idA = a.id.toUpperCase();
    const idB = b.id.toUpperCase();
    if (idA < idB) {
      return -1;
    }
    if (idA > idB) {
      return 1;
    }
    return 0;
  }
}
