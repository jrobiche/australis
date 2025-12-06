import { Injectable, inject } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';

import { GameConsoleConfiguration, GameListEntry } from '@app/shared/types/app';
import { AuroraAssetType, AuroraGameData } from '../types/aurora';

@Injectable({
  providedIn: 'root',
})
export class AuroraGameService {
  constructor() {}

  assetImageUrl(
    configuration: GameConsoleConfiguration,
    gameData: AuroraGameData,
    assetType: AuroraAssetType,
  ): Promise<string | null> {
    return invoke('aurora_game_asset_image_read_url', {
      consoleConfiguration: configuration,
      game: gameData,
      assetTypeUsize: assetType.valueOf(),
    });
  }

  deleteAssetImage(
    configuration: GameConsoleConfiguration,
    gameData: AuroraGameData,
    assetType: AuroraAssetType,
  ): Promise<void> {
    return invoke('aurora_game_asset_image_delete', {
      consoleConfiguration: configuration,
      game: gameData,
      assetTypeUsize: assetType.valueOf(),
    });
  }

  gameData(
    configuration: GameConsoleConfiguration,
    gameId: number,
  ): Promise<AuroraGameData | null> {
    if (!Number.isInteger(gameId)) {
      let msg = `Refusing to get game data for game with non-integer id '${gameId}'`;
      return Promise.reject(new Error(msg));
    }
    return invoke('aurora_game_read', {
      consoleConfiguration: configuration,
      gameId: gameId,
    });
  }

  list(configuration: GameConsoleConfiguration): Promise<GameListEntry[]> {
    return invoke('aurora_game_entry_read_all', {
      consoleConfiguration: configuration,
    });
  }

  listSorted(
    configuration: GameConsoleConfiguration,
  ): Promise<GameListEntry[]> {
    return this.list(configuration).then((gameList) => {
      return gameList.sort(this.compareGameListEntries);
    });
  }

  launch(
    configuration: GameConsoleConfiguration,
    authenticationToken: string | null,
    game: AuroraGameData,
  ): Promise<void> {
    return invoke('aurora_game_launch', {
      consoleConfiguration: configuration,
      token: authenticationToken,
      game: game,
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
    return invoke('aurora_game_asset_image_update', {
      consoleConfiguration: configuration,
      game: gameData,
      assetTypeUsize: assetType.valueOf(),
      fileData: assetImageBytes,
    });
  }

  compareGameListEntries(a: GameListEntry, b: GameListEntry) {
    // compare title names
    const nameA = a.titleName.toUpperCase();
    const nameB = b.titleName.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names are the same, compare ids
    const idA = a.id;
    const idB = b.id;
    if (idA < idB) {
      return -1;
    }
    if (idA > idB) {
      return 1;
    }
    return 0;
  }
}
