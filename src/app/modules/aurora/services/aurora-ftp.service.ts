import { Injectable, inject } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';

import { GameConsoleConfiguration } from '@app/shared/types/app';
import { AuroraGameData } from '../types/aurora';

@Injectable({
  providedIn: 'root',
})
export class AuroraFtpService {
  constructor() {}

  downloadAuroraDatabases(
    configuration: GameConsoleConfiguration,
  ): Promise<void> {
    return invoke('aurora_ftp_download_aurora_databases', {
      consoleConfiguration: configuration,
    });
  }

  downloadAuroraGameDataDirectory(
    configuration: GameConsoleConfiguration,
    directoryName: string,
  ): Promise<void> {
    return invoke('aurora_ftp_download_aurora_game_data_directory', {
      consoleConfiguration: configuration,
      directoryName: directoryName,
    });
  }

  listAuroraGameDataDirectories(
    configuration: GameConsoleConfiguration,
  ): Promise<string[]> {
    return invoke('aurora_ftp_list_aurora_game_data_directories', {
      consoleConfiguration: configuration,
    });
  }

  uploadAuroraGameAssets(
    configuration: GameConsoleConfiguration,
    gameData: AuroraGameData,
  ): Promise<void> {
    return invoke('aurora_ftp_upload_game_assets', {
      consoleConfiguration: configuration,
      game: gameData,
    });
  }
}
