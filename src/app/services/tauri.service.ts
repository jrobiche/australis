import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';

import {
  AuroraAchievement,
  AuroraAchievementPlayer,
  AuroraAssetType,
  AuroraDashlaunch,
  AuroraFilebrowserEntry,
  AuroraGameData,
  AuroraMemory,
  AuroraMultidisc,
  AuroraPlugin,
  AuroraProfile,
  AuroraScreencaptureMeta,
  AuroraScreencaptureMetaListCount,
  AuroraSmc,
  AuroraSystem,
  AuroraSystemlink,
  AuroraSystemlinkBandwidth,
  AuroraTemperature,
  AuroraThread,
  AuroraThreadState,
  AuroraTitle,
  AuroraUpdateNotification,
} from '@app/types/aurora';
import {
  GameAssetTypes,
  GameConsoleConfiguration,
  GameListEntry,
} from '@app/types/app';
import { LiveImage } from '@app/types/xbox-catalog';
import { CoverInfoResult, TitleListResult } from '@app/types/xbox-unity';

@Injectable({
  providedIn: 'root',
})
export class TauriService {
  /*
   * This class should have a function for each tauri command defined
   * in the `invoke_handler` in `src-tauri/src/lib.rs`
   */

  constructor() {}

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

  auroraGameAssetImageReadUrl(
    consoleConfiguration: GameConsoleConfiguration,
    game: AuroraGameData,
    assetType: AuroraAssetType,
  ): Promise<string | null> {
    return invoke('aurora_game_asset_image_read_url', {
      consoleConfiguration: consoleConfiguration,
      game: game,
      assetTypeUsize: assetType.valueOf(),
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

  auroraGameAssetTypesReadAll(
    consoleConfiguration: GameConsoleConfiguration,
  ): Promise<GameAssetTypes[]> {
    return invoke('aurora_game_asset_types_read_all', {
      consoleConfiguration: consoleConfiguration,
    });
  }

  auroraGameEntryReadAll(
    consoleConfiguration: GameConsoleConfiguration,
  ): Promise<GameListEntry[]> {
    return invoke('aurora_game_entry_read_all', {
      consoleConfiguration: consoleConfiguration,
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
    });
  }

  ////////////////////////////////////////////////////////////////////////////////
  // aurora http commands
  ////////////////////////////////////////////////////////////////////////////////
  auroraHttpAchievementGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraAchievement[]> {
    return invoke('aurora_http_achievement_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  auroraHttpAchievementPlayerGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraAchievementPlayer> {
    return invoke('aurora_http_achievement_player_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  auroraHttpAuthenticationTokenGet(
    consoleConfiguration: GameConsoleConfiguration,
  ): Promise<string | null> {
    return invoke('aurora_http_authentication_token_get', {
      consoleConfiguration: consoleConfiguration,
    });
  }

  auroraHttpDashlaunchGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraDashlaunch> {
    return invoke('aurora_http_dashlaunch_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  auroraHttpFilebrowserGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
    path: string | null,
    filter: string | null,
  ): Promise<AuroraFilebrowserEntry[]> {
    return invoke('aurora_http_filebrowser_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
      path: path,
      filter: filter,
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
    });
  }

  auroraHttpMemoryGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraMemory> {
    return invoke('aurora_http_memory_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  auroraHttpMultidiscGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraMultidisc> {
    return invoke('aurora_http_multidisc_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  auroraHttpPluginGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraPlugin> {
    return invoke('aurora_http_plugin_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  auroraHttpProfileGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraProfile[]> {
    return invoke('aurora_http_profile_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
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
    });
  }

  auroraHttpScreencaptureMetaGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraScreencaptureMeta> {
    return invoke('aurora_http_screencapture_meta_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  auroraHttpScreencaptureMetaListGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraScreencaptureMeta[]> {
    return invoke('aurora_http_screencapture_meta_list_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  auroraHttpScreencaptureMetaListCountGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraScreencaptureMetaListCount> {
    return invoke('aurora_http_screencapture_meta_list_count_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  auroraHttpSmcGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraSmc> {
    return invoke('aurora_http_smc_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  auroraHttpSystemGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraSystem> {
    return invoke('aurora_http_system_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  auroraHttpSystemlinkGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraSystemlink> {
    return invoke('aurora_http_systemlink_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  auroraHttpSystemlinkBandwidthGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraSystemlinkBandwidth> {
    return invoke('aurora_http_systemlink_bandwidth_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  auroraHttpTemperatureGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraTemperature> {
    return invoke('aurora_http_temperature_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  auroraHttpThreadGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraThread[]> {
    return invoke('aurora_http_thread_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  auroraHttpThreadStateGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraThreadState> {
    return invoke('aurora_http_thread_state_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
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
    });
  }

  auroraHttpTitleGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraTitle> {
    return invoke('aurora_http_title_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
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
    });
  }

  auroraHttpTitleLiveCacheGet(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<string> {
    return invoke('aurora_http_title_live_cache_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  // TODO test
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
  ): Promise<AuroraUpdateNotification> {
    return invoke('aurora_http_update_notification_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
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
    });
  }

  gameConsoleConfigurationReadAll(): Promise<GameConsoleConfiguration[]> {
    return invoke('game_console_configuration_read_all');
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
    });
  }

  ////////////////////////////////////////////////////////////////////////////////
  // xboxcatalog commands
  ////////////////////////////////////////////////////////////////////////////////
  xboxCatalogLiveImageBytesUrl(liveImage: LiveImage): Promise<string | null> {
    return invoke('xboxcatalog_live_image_bytes_url', {
      liveImage: liveImage,
    });
  }

  xboxCatalogLiveImages(titleId: string, locale: string): Promise<LiveImage[]> {
    return invoke('xboxcatalog_live_images', {
      titleId: titleId,
      locale: locale,
    });
  }

  ////////////////////////////////////////////////////////////////////////////////
  // xboxunity commands
  ////////////////////////////////////////////////////////////////////////////////
  xboxUnityCoverImageBytesUrl(
    coverId: string,
    coverSize: 'small' | 'large',
  ): Promise<string | null> {
    return invoke('xboxunity_cover_image_bytes_url', {
      coverId: coverId,
      coverSize: coverSize,
    });
  }

  xboxUnityCoverImageUrl(
    coverId: string,
    coverSize: 'small' | 'large',
  ): Promise<string> {
    return invoke('xboxunity_cover_image_url', {
      coverId: coverId,
      coverSize: coverSize,
    });
  }

  xboxUnityCoverInfo(titleId: string): Promise<CoverInfoResult> {
    return invoke('xboxunity_cover_info', {
      titleId: titleId,
    });
  }

  xboxUnityIconImageUrl(titleId: string): Promise<string> {
    return invoke('xboxunity_icon_image_url', {
      titleId: titleId,
    });
  }

  xboxUnityTitleList(
    query: string,
    page: number,
    count: number | null,
  ): Promise<TitleListResult> {
    return invoke('xboxunity_title_list', {
      query: query,
      page: page,
      count: count,
    });
  }
}
