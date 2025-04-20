import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';

import { AssetImageData } from '../interfaces/asset';
import { AuroraAssetType, AuroraGameData } from '../interfaces/aurora';
import {
  ConsoleAchievement,
  ConsoleAchievementPlayer,
  ConsoleDashlaunch,
  ConsoleFilebrowserEntry,
  ConsoleMemory,
  ConsoleMultidisc,
  ConsolePlugin,
  ConsoleProfile,
  ConsoleScreencaptureMeta,
  ConsoleScreencaptureMetaListCount,
  ConsoleSmc,
  ConsoleSystem,
  ConsoleSystemlink,
  ConsoleSystemlinkBandwidth,
  ConsoleTemperature,
  ConsoleThread,
  ConsoleThreadState,
  ConsoleTitle,
  ConsoleUpdateNotification,
} from '../interfaces/aurora-http-schemas';
import { GameConsoleConfiguration } from '../interfaces/game-console-configuration';
import { GameListEntry } from '../interfaces/game-list-entry';

@Injectable({
  providedIn: 'root',
})
export class TauriService {
  #resolvers: any;
  #resolverCount: number;

  constructor() {
    this.#resolvers = {};
    this.#resolverCount = 0;
  }

  ////////////////////////////////////////////////////////////////////////////////
  // aurora ftp commands
  ////////////////////////////////////////////////////////////////////////////////
  auroraFtpDownloadDatabases(
    consoleConfiguration: GameConsoleConfiguration,
  ): Promise<void> {
    return invoke('aurora_ftp_download_aurora_databases', {
      consoleConfiguration: consoleConfiguration,
    });
  }

  auroraFtpDownloadGameDataDirectory(
    consoleConfiguration: GameConsoleConfiguration,
    directoryName: string,
  ): Promise<void> {
    return invoke('aurora_ftp_download_aurora_game_data_directory', {
      consoleConfiguration: consoleConfiguration,
      directoryName: directoryName,
    });
  }

  auroraFtpListGameDataDirectories(
    consoleConfiguration: GameConsoleConfiguration,
  ): Promise<string[]> {
    return invoke('aurora_ftp_list_aurora_game_data_directories', {
      consoleConfiguration: consoleConfiguration,
    });
  }

  auroraFtpUploadGameAssets(
    consoleConfiguration: GameConsoleConfiguration,
    gameData: AuroraGameData,
  ): Promise<void> {
    return invoke('aurora_ftp_upload_game_assets', {
      consoleConfiguration: consoleConfiguration,
      game: gameData,
    });
  }

  ////////////////////////////////////////////////////////////////////////////////
  // aurora game commands
  ////////////////////////////////////////////////////////////////////////////////
  auroraGameAssetImageDelete(
    consoleConfiguration: GameConsoleConfiguration,
    game: AuroraGameData,
    assetType: AuroraAssetType,
  ): Promise<void> {
    return invoke('aurora_game_asset_image_delete', {
      consoleConfiguration: consoleConfiguration,
      game: game,
      assetTypeUsize: assetType.valueOf(),
    });
  }

  auroraGameAssetImageRead(
    consoleConfiguration: GameConsoleConfiguration,
    game: AuroraGameData,
    assetType: AuroraAssetType,
  ): Promise<AssetImageData | null> {
    return invoke('aurora_game_asset_image_read', {
      consoleConfiguration: consoleConfiguration,
      game: game,
      assetTypeUsize: assetType.valueOf(),
    }).then((response) => {
      return response as AssetImageData | null;
    });
  }

  auroraGameAssetImageReadUrl(
    consoleConfiguration: GameConsoleConfiguration,
    game: AuroraGameData,
    assetType: AuroraAssetType,
  ): Promise<string | null> {
    return invoke('aurora_game_asset_image_read_url', {
      consoleConfiguration: consoleConfiguration,
      game: game,
      assetTypeUsize: assetType.valueOf(),
    }).then((response) => {
      return response as string | null;
    });
  }

  auroraGameAssetImageUpdate(
    consoleConfiguration: GameConsoleConfiguration,
    game: AuroraGameData,
    assetType: AuroraAssetType,
    imageBytes: Uint8Array,
  ): Promise<void> {
    return invoke('aurora_game_asset_image_update', {
      consoleConfiguration: consoleConfiguration,
      game: game,
      assetTypeUsize: assetType.valueOf(),
      fileData: imageBytes,
    });
  }

  auroraGameEntryReadAll(
    consoleConfiguration: GameConsoleConfiguration,
  ): Promise<GameListEntry[]> {
    return invoke('aurora_game_entry_read_all', {
      consoleConfiguration: consoleConfiguration,
    }).then((response) => {
      return response as GameListEntry[];
    });
  }

  auroraGameLaunch(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
    game: AuroraGameData,
  ): Promise<void> {
    return invoke('aurora_game_launch', {
      consoleConfiguration: consoleConfiguration,
      token: token,
      game: game,
    });
  }

  auroraGameRead(
    consoleConfiguration: GameConsoleConfiguration,
    gameId: number,
  ): Promise<AuroraGameData | null> {
    return invoke('aurora_game_read', {
      consoleConfiguration: consoleConfiguration,
      gameId: gameId,
    }).then((response) => {
      if (response) {
        return response as AuroraGameData;
      } else {
        return null;
      }
    });
  }

  ////////////////////////////////////////////////////////////////////////////////
  // aurora http commands
  ////////////////////////////////////////////////////////////////////////////////
  auroraHttpAchievementGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<ConsoleAchievement[]> {
    return invoke('aurora_http_achievement_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    }).then((response) => {
      return Promise.resolve(response as ConsoleAchievement[]);
    });
  }

  auroraHttpAchievementPlayerGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<ConsoleAchievementPlayer> {
    return invoke('aurora_http_achievement_player_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    }).then((response) => {
      return Promise.resolve(response as ConsoleAchievementPlayer);
    });
  }

  auroraHttpAuthenticationTokenGet(
    consoleConfiguration: GameConsoleConfiguration,
  ): Promise<string | null> {
    return invoke('aurora_http_authentication_token_get', {
      consoleConfiguration: consoleConfiguration,
    }).then((response) => {
      return Promise.resolve(response as string | null);
    });
  }

  auroraHttpDashlaunchGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<ConsoleDashlaunch> {
    return invoke('aurora_http_dashlaunch_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    }).then((response) => {
      return Promise.resolve(response as ConsoleDashlaunch);
    });
  }

  auroraHttpFilebrowserGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
    path: string | null,
    filter: string | null,
  ): Promise<ConsoleFilebrowserEntry[]> {
    return invoke('aurora_http_filebrowser_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
      path: path,
      filter: filter,
    }).then((response) => {
      return Promise.resolve(response as ConsoleFilebrowserEntry[]);
    });
  }

  auroraHttpImageAchievementGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
    uuid: string,
  ): Promise<number[]> {
    return invoke('aurora_http_image_achievement_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
      uuid: uuid,
    }).then((response) => {
      return Promise.resolve(response as number[]);
    });
  }

  auroraHttpImageAchievementGetUrl(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
    uuid: string,
  ): Promise<string> {
    return invoke('aurora_http_image_achievement_get_url', {
      consoleConfiguration: consoleConfiguration,
      token: token,
      uuid: uuid,
    }).then((response) => {
      return Promise.resolve(response as string);
    });
  }

  auroraHttpImageProfileGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
    uuid: number,
  ): Promise<number[]> {
    return invoke('aurora_http_image_profile_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
      uuid: uuid,
    }).then((response) => {
      return Promise.resolve(response as number[]);
    });
  }

  auroraHttpImageProfileGetUrl(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
    uuid: number,
  ): Promise<string> {
    return invoke('aurora_http_image_profile_get_url', {
      consoleConfiguration: consoleConfiguration,
      token: token,
      uuid: uuid,
    }).then((response) => {
      return Promise.resolve(response as string);
    });
  }

  auroraHttpImageScreencaptureGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
    uuid: string,
  ): Promise<number[]> {
    return invoke('aurora_http_image_screencapture_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
      uuid: uuid,
    }).then((response) => {
      return Promise.resolve(response as number[]);
    });
  }

  auroraHttpImageScreencaptureGetUrl(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
    uuid: string,
  ): Promise<string> {
    return invoke('aurora_http_image_screencapture_get_url', {
      consoleConfiguration: consoleConfiguration,
      token: token,
      uuid: uuid,
    }).then((response) => {
      return Promise.resolve(response as string);
    });
  }

  auroraHttpMemoryGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<ConsoleMemory> {
    return invoke('aurora_http_memory_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    }).then((response) => {
      return Promise.resolve(response as ConsoleMemory);
    });
  }

  auroraHttpMultidiscGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<ConsoleMultidisc> {
    return invoke('aurora_http_multidisc_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    }).then((response) => {
      return Promise.resolve(response as ConsoleMultidisc);
    });
  }

  auroraHttpPluginGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<ConsolePlugin> {
    return invoke('aurora_http_plugin_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    }).then((response) => {
      return Promise.resolve(response as ConsolePlugin);
    });
  }

  auroraHttpProfileGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<ConsoleProfile[]> {
    return invoke('aurora_http_profile_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    }).then((response) => {
      return Promise.resolve(response as ConsoleProfile[]);
    });
  }

  auroraHttpScreencaptureDelete(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
    uuid: string,
  ): Promise<void> {
    return invoke('aurora_http_screencapture_delete', {
      consoleConfiguration: consoleConfiguration,
      token: token,
      uuid: uuid,
    }).then((_) => {
      return Promise.resolve();
    });
  }

  auroraHttpScreencaptureMetaGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<ConsoleScreencaptureMeta> {
    return invoke('aurora_http_screencapture_meta_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    }).then((response) => {
      return Promise.resolve(response as ConsoleScreencaptureMeta);
    });
  }

  auroraHttpScreencaptureMetaListGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<ConsoleScreencaptureMeta[]> {
    return invoke('aurora_http_screencapture_meta_list_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    }).then((response) => {
      return Promise.resolve(response as ConsoleScreencaptureMeta[]);
    });
  }

  auroraHttpScreencaptureMetaListCountGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<ConsoleScreencaptureMetaListCount> {
    return invoke('aurora_http_screencapture_meta_list_count_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    }).then((response) => {
      return Promise.resolve(response as ConsoleScreencaptureMetaListCount);
    });
  }

  auroraHttpSmcGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<ConsoleSmc> {
    return invoke('aurora_http_smc_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    }).then((response) => {
      return Promise.resolve(response as ConsoleSmc);
    });
  }

  auroraHttpSystemGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<ConsoleSystem> {
    return invoke('aurora_http_system_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    }).then((response) => {
      return Promise.resolve(response as ConsoleSystem);
    });
  }

  auroraHttpSystemlinkGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<ConsoleSystemlink> {
    return invoke('aurora_http_systemlink_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    }).then((response) => {
      return Promise.resolve(response as ConsoleSystemlink);
    });
  }

  auroraHttpSystemlinkBandwidthGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<ConsoleSystemlinkBandwidth> {
    return invoke('aurora_http_systemlink_bandwidth_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    }).then((response) => {
      return Promise.resolve(response as ConsoleSystemlinkBandwidth);
    });
  }

  auroraHttpTemperatureGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<ConsoleTemperature> {
    return invoke('aurora_http_temperature_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    }).then((response) => {
      return Promise.resolve(response as ConsoleTemperature);
    });
  }

  auroraHttpThreadGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<ConsoleThread[]> {
    return invoke('aurora_http_thread_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    }).then((response) => {
      return Promise.resolve(response as ConsoleThread[]);
    });
  }

  auroraHttpThreadStateGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<ConsoleThreadState> {
    return invoke('aurora_http_thread_state_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    }).then((response) => {
      return Promise.resolve(response as ConsoleThreadState);
    });
  }

  auroraHttpThreadStatePost(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
    suspend: boolean,
  ): Promise<void> {
    return invoke('aurora_http_thread_state_post', {
      consoleConfiguration: consoleConfiguration,
      token: token,
      suspend: suspend,
    }).then((_) => {
      return Promise.resolve();
    });
  }

  auroraHttpTitleGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<ConsoleTitle> {
    return invoke('aurora_http_title_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    }).then((response) => {
      return Promise.resolve(response as ConsoleTitle);
    });
  }

  auroraHttpTitleFileGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
    path: string,
  ): Promise<number[]> {
    return invoke('aurora_http_title_file_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
      path: path,
    }).then((response) => {
      return Promise.resolve(response as number[]);
    });
  }

  auroraHttpTitleLaunchPost(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
    path: string,
    exec: string,
    execType: number,
  ): Promise<void> {
    return invoke('aurora_http_title_launch_post', {
      consoleConfiguration: consoleConfiguration,
      token: token,
      path: path,
      exec: exec,
      execType: execType,
    }).then((_) => {
      return Promise.resolve();
    });
  }

  auroraHttpTitleLiveCacheGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<string> {
    return invoke('aurora_http_title_live_cache_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    }).then((response) => {
      return Promise.resolve(response as string);
    });
  }

  auroraHttpTitleLiveCachePost(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
    liveinfo: string,
  ): Promise<void> {
    return invoke('aurora_http_title_live_cache_post', {
      consoleConfiguration: consoleConfiguration,
      token: token,
      liveinfo: liveinfo,
    });
  }

  auroraHttpUpdateNotificationGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<ConsoleUpdateNotification> {
    return invoke('aurora_http_update_notification_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    }).then((response) => {
      return Promise.resolve(response as ConsoleUpdateNotification);
    });
  }

  ////////////////////////////////////////////////////////////////////////////////
  // game console commands
  ////////////////////////////////////////////////////////////////////////////////
  gameConsoleConfigurationCreate(
    gameConsoleConfiguration: GameConsoleConfiguration,
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
    }).then((response) => {
      return response as GameConsoleConfiguration;
    });
  }

  gameConsoleConfigurationDelete(id: string): Promise<void> {
    return invoke('game_console_configuration_delete', {
      consoleConfigurationId: id,
    });
  }

  gameConsoleConfigurationRead(id: string): Promise<GameConsoleConfiguration> {
    return invoke('game_console_configuration_read', {
      consoleConfigurationId: id,
    }).then((response) => {
      return response as GameConsoleConfiguration;
    });
  }

  gameConsoleConfigurationReadAll(): Promise<GameConsoleConfiguration[]> {
    return invoke('game_console_configuration_read_all').then((response) => {
      return response as GameConsoleConfiguration[];
    });
  }

  gameConsoleConfigurationUpdate(
    id: string | null,
    consoleConfig: GameConsoleConfiguration,
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
    }).then((response) => {
      return response as GameConsoleConfiguration;
    });
  }
}
