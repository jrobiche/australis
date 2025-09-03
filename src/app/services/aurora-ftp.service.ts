import { Injectable, inject } from '@angular/core';

import { AuroraGameData } from '@app/types/aurora';
import { GameConsoleConfiguration } from '@app/types/app';
import { TauriService } from '@app/services/tauri.service';

@Injectable({
  providedIn: 'root',
})
export class AuroraFtpService {
  readonly #tauriService = inject(TauriService);

  ftpService: TauriService;

  constructor() {
    this.ftpService = this.#tauriService;
  }

  downloadAuroraDatabases(
    configuration: GameConsoleConfiguration,
  ): Promise<void> {
    return this.ftpService.auroraFtpDownloadDatabases(configuration);
  }

  downloadAuroraGameDataDirectory(
    configuration: GameConsoleConfiguration,
    directoryName: string,
  ): Promise<void> {
    return this.ftpService.auroraFtpDownloadGameDataDirectory(
      configuration,
      directoryName,
    );
  }

  listAuroraGameDataDirectories(
    configuration: GameConsoleConfiguration,
  ): Promise<string[]> {
    return this.ftpService.auroraFtpListGameDataDirectories(configuration);
  }

  uploadAuroraGameAssets(
    configuration: GameConsoleConfiguration,
    gameData: AuroraGameData,
  ): Promise<void> {
    return this.ftpService.auroraFtpUploadGameAssets(configuration, gameData);
  }
}
