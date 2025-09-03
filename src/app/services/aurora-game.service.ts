import { Injectable, inject } from '@angular/core';

import { AuroraAssetType, AuroraGameData } from '@app/types/aurora';
import { AuroraHttpService } from '@app/services/aurora-http.service';
import { GameConsoleConfiguration, GameListEntry } from '@app/types/app';
import { TauriService } from '@app/services/tauri.service';

@Injectable({
  providedIn: 'root',
})
export class AuroraGameService {
  readonly #auroraHttpService = inject(AuroraHttpService);
  readonly #tauriService = inject(TauriService);

  gameService: TauriService;

  constructor() {
    this.gameService = this.#tauriService;
  }

  assetImageUrl(
    configuration: GameConsoleConfiguration,
    gameData: AuroraGameData,
    assetType: AuroraAssetType,
  ): Promise<string | null> {
    return this.gameService.auroraGameAssetImageReadUrl(
      configuration,
      gameData,
      assetType,
    );
  }

  deleteAssetImage(
    configuration: GameConsoleConfiguration,
    gameData: AuroraGameData,
    assetType: AuroraAssetType,
  ): Promise<void> {
    return this.gameService.auroraGameAssetImageDelete(
      configuration,
      gameData,
      assetType,
    );
  }

  gameData(
    configuration: GameConsoleConfiguration,
    gameId: number,
  ): Promise<AuroraGameData | null> {
    if (!Number.isInteger(gameId)) {
      let msg = `Refusing to get game data for game with non-integer id '${gameId}'`;
      return Promise.reject(new Error(msg));
    }
    return this.gameService.auroraGameRead(configuration, gameId);
  }

  list(configuration: GameConsoleConfiguration): Promise<GameListEntry[]> {
    return this.gameService
      .auroraGameEntryReadAll(configuration)
      .then((entries) => {
        return Promise.resolve(entries);
      });
  }

  // TODO have a aurora_game_executable_data function?

  // TODO improve this
  launch(
    configuration: GameConsoleConfiguration,
    game: AuroraGameData,
  ): Promise<void> {
    return this.#auroraHttpService
      .login(configuration)
      .then((authenticationToken) => {
        return this.gameService.auroraGameLaunch(
          configuration,
          authenticationToken,
          game,
        );
      });
  }

  screenshotAssetImageUrl(
    configuration: GameConsoleConfiguration,
    gameData: AuroraGameData,
    screenshotIndex: number,
  ): Promise<string | null> {
    let assetType: AuroraAssetType = AuroraAssetType.Screenshot1;
    switch (screenshotIndex) {
      case 0:
        assetType = AuroraAssetType.Screenshot1;
        break;
      case 1:
        assetType = AuroraAssetType.Screenshot2;
        break;
      case 2:
        assetType = AuroraAssetType.Screenshot3;
        break;
      case 3:
        assetType = AuroraAssetType.Screenshot4;
        break;
      case 4:
        assetType = AuroraAssetType.Screenshot5;
        break;
      case 5:
        assetType = AuroraAssetType.Screenshot6;
        break;
      case 6:
        assetType = AuroraAssetType.Screenshot7;
        break;
      case 7:
        assetType = AuroraAssetType.Screenshot8;
        break;
      case 8:
        assetType = AuroraAssetType.Screenshot9;
        break;
      case 9:
        assetType = AuroraAssetType.Screenshot10;
        break;
      case 10:
        assetType = AuroraAssetType.Screenshot11;
        break;
      case 11:
        assetType = AuroraAssetType.Screenshot12;
        break;
      case 12:
        assetType = AuroraAssetType.Screenshot13;
        break;
      case 13:
        assetType = AuroraAssetType.Screenshot14;
        break;
      case 14:
        assetType = AuroraAssetType.Screenshot15;
        break;
      case 15:
        assetType = AuroraAssetType.Screenshot16;
        break;
      case 16:
        assetType = AuroraAssetType.Screenshot17;
        break;
      case 17:
        assetType = AuroraAssetType.Screenshot18;
        break;
      case 18:
        assetType = AuroraAssetType.Screenshot19;
        break;
      case 19:
        assetType = AuroraAssetType.Screenshot20;
        break;
      default:
        return Promise.reject(new Error('Invalid screenshot index'));
    }
    return this.assetImageUrl(configuration, gameData, assetType);
  }

  updateAssetImage(
    configuration: GameConsoleConfiguration,
    gameData: AuroraGameData,
    assetType: AuroraAssetType,
    assetImageBytes: Uint8Array,
  ): Promise<void> {
    return this.gameService.auroraGameAssetImageUpdate(
      configuration,
      gameData,
      assetType,
      assetImageBytes,
    );
  }
}
