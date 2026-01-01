import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';

import { GameConsoleConfiguration } from '@app/shared/types/app';
import { DirlistEntry, TelnetResponse } from '../types/telnet';

@Injectable({
  providedIn: 'root',
})
export class TelnetService {
  constructor() {}

  exec(
    configuration: GameConsoleConfiguration,
    command: string,
  ): Promise<TelnetResponse> {
    return invoke('telnet_exec', {
      consoleConfiguration: configuration,
      command: command,
    });
  }

  dirlist(
    configuration: GameConsoleConfiguration,
    path: string[],
  ): Promise<DirlistEntry[]> {
    return invoke('telnet_exec_dirlist', {
      consoleConfiguration: configuration,
      path: path,
    });
  }

  drivelist(configuration: GameConsoleConfiguration): Promise<string[]> {
    return invoke('telnet_exec_drivelist', {
      consoleConfiguration: configuration,
    });
  }

  // TODO is there a better return type for Vec<u8>?
  getmem(
    configuration: GameConsoleConfiguration,
    address: number,
    length: number,
  ): Promise<number[]> {
    return invoke('telnet_exec_getmem', {
      consoleConfiguration: configuration,
      address: address,
      length: length,
    });
  }

  go(configuration: GameConsoleConfiguration): Promise<TelnetResponse> {
    return invoke('telnet_exec_go', {
      consoleConfiguration: configuration,
    });
  }

  magicboot(
    configuration: GameConsoleConfiguration,
    path: string[],
  ): Promise<TelnetResponse> {
    return invoke('telnet_exec_magicboot', {
      consoleConfiguration: configuration,
      path: path,
    });
  }

  stop(configuration: GameConsoleConfiguration): Promise<TelnetResponse> {
    return invoke('telnet_exec_stop', {
      consoleConfiguration: configuration,
    });
  }
}
