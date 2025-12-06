import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';

import { GameConsoleConfiguration } from '@app/shared/types/app';
import {
  AuroraAchievement,
  AuroraAchievementPlayer,
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
} from '../types/aurora';

@Injectable({
  providedIn: 'root',
})
export class AuroraHttpService {
  constructor() {}

  getAchievement(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraAchievement[]> {
    return invoke('aurora_http_achievement_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  getAchievementPlayer(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraAchievementPlayer> {
    return invoke('aurora_http_achievement_player_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  getAuthenticationToken(
    consoleConfiguration: GameConsoleConfiguration,
  ): Promise<string | null> {
    return invoke('aurora_http_authentication_token_get', {
      consoleConfiguration: consoleConfiguration,
    });
  }

  getDashlaunch(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraDashlaunch> {
    return invoke('aurora_http_dashlaunch_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  getFilebrowser(
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

  getImageAchievement(
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

  getImageAchievementUrl(
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

  getImageProfile(
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

  getImageProfileUrl(
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

  getImageScreencapture(
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

  getImageScreencaptureUrl(
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

  getMemory(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraMemory> {
    return invoke('aurora_http_memory_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  getMultidisc(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraMultidisc> {
    return invoke('aurora_http_multidisc_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  getPlugin(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraPlugin> {
    return invoke('aurora_http_plugin_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  getProfile(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraProfile[]> {
    return invoke('aurora_http_profile_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  deleteScreencapture(
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

  getScreencaptureMeta(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraScreencaptureMeta> {
    return invoke('aurora_http_screencapture_meta_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  getScreencaptureMetaList(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraScreencaptureMeta[]> {
    return invoke('aurora_http_screencapture_meta_list_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  getScreencaptureMetaListCount(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraScreencaptureMetaListCount> {
    return invoke('aurora_http_screencapture_meta_list_count_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  getSmc(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraSmc> {
    return invoke('aurora_http_smc_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  getSystem(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraSystem> {
    return invoke('aurora_http_system_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  getSystemlink(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraSystemlink> {
    return invoke('aurora_http_systemlink_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  getSystemlinkBandwidth(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraSystemlinkBandwidth> {
    return invoke('aurora_http_systemlink_bandwidth_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  getTemperature(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraTemperature> {
    return invoke('aurora_http_temperature_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  getThread(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraThread[]> {
    return invoke('aurora_http_thread_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  getThreadState(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraThreadState> {
    return invoke('aurora_http_thread_state_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  postThreadState(
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

  getTitle(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraTitle> {
    return invoke('aurora_http_title_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  getTitleFile(
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

  postTitleLaunch(
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

  getTitleLiveCache(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<string> {
    return invoke('aurora_http_title_live_cache_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }

  // TODO test
  postTitleLiveCache(
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

  getUpdateNotification(
    consoleConfiguration: GameConsoleConfiguration,
    token: string | null,
  ): Promise<AuroraUpdateNotification> {
    return invoke('aurora_http_update_notification_get', {
      consoleConfiguration: consoleConfiguration,
      token: token,
    });
  }
}
