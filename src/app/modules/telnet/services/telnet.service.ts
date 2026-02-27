import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';

import { GameConsoleConfiguration } from '@app/shared/types/app';
import {
  DirlistEntry,
  Drivefreespace,
  DrivelistEntry,
  TelnetResponse,
} from '../types/telnet';

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

  drivefreespace(
    configuration: GameConsoleConfiguration,
    name: string,
  ): Promise<Drivefreespace> {
    return invoke('telnet_exec_drivefreespace', {
      consoleConfiguration: configuration,
      name: name,
    });
  }

  drivelist(
    configuration: GameConsoleConfiguration,
  ): Promise<DrivelistEntry[]> {
    return invoke('telnet_exec_drivelist', {
      consoleConfiguration: configuration,
    });
  }

  dvdeject(configuration: GameConsoleConfiguration): Promise<void> {
    return invoke('telnet_exec_dvdeject', {
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

  go(configuration: GameConsoleConfiguration): Promise<void> {
    return invoke('telnet_exec_go', {
      consoleConfiguration: configuration,
    });
  }

  magicboot(configuration: GameConsoleConfiguration): Promise<void> {
    return invoke('telnet_exec_magicboot', {
      consoleConfiguration: configuration,
    });
  }

  magicboot_cold(configuration: GameConsoleConfiguration): Promise<void> {
    return invoke('telnet_exec_magicboot_cold', {
      consoleConfiguration: configuration,
    });
  }

  magicboot_path(
    configuration: GameConsoleConfiguration,
    path: string[],
  ): Promise<void> {
    return invoke('telnet_exec_magicboot_path', {
      consoleConfiguration: configuration,
      path: path,
    });
  }

  setmem(
    configuration: GameConsoleConfiguration,
    address: number,
    data: string,
  ): Promise<void> {
    return invoke('telnet_exec_setmem', {
      consoleConfiguration: configuration,
      address: address,
      data: data,
    });
  }

  stop(configuration: GameConsoleConfiguration): Promise<void> {
    return invoke('telnet_exec_stop', {
      consoleConfiguration: configuration,
    });
  }

  shutdown(configuration: GameConsoleConfiguration): Promise<void> {
    return invoke('telnet_exec_shutdown', {
      consoleConfiguration: configuration,
    });
  }
}
