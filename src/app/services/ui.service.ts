import { Injectable, inject, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { invoke } from '@tauri-apps/api/core';

import { GameConsole } from '../classes/game-console';
import {
  ConsoleMemory,
  ConsolePlugin,
  ConsoleSmc,
  ConsoleSystem,
  ConsoleTemperature,
  ConsoleThread,
  ConsoleThreadState,
} from '../interfaces/aurora-http-schemas';
import { GameConsoleConfiguration } from '../interfaces/game-console-configuration';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private readonly _snackBar = inject(MatSnackBar);
  readonly consoleConfigurations = signal<GameConsoleConfiguration[]>([]);
  readonly selectedConsole = signal<GameConsole | null>(null);
  readonly defaultConsoleMemory: ConsoleMemory;
  readonly defaultConsolePlugin: ConsolePlugin;
  readonly defaultConsoleSmc: ConsoleSmc;
  readonly defaultConsoleSystem: ConsoleSystem;
  readonly defaultConsoleTemperature: ConsoleTemperature;
  readonly defaultConsoleThreads: ConsoleThread[];
  readonly defaultConsoleThreadState: ConsoleThreadState;
  consoleRequestMaxFailureCount: number;
  consoleRequestRate: number;

  constructor() {
    this.consoleRequestMaxFailureCount = 10;
    this.consoleRequestRate = 500;
    this.defaultConsoleMemory = {
      free: 0,
      total: 0,
      used: 0,
    };
    this.defaultConsolePlugin = {
      features: {
        achievements: 0,
        debugger: 0,
        gamepad: 0,
        httpdaemon: 0,
        multidisc: 0,
        network: 0,
        systemlink: 0,
        threads: 0,
        trainers: 0,
      },
      path: {
        launcher: 'Unavailable',
        root: 'Unavailable',
        user: 'Unavailable',
        web: 'Unavailable',
      },
      version: {
        api: 0,
        number: {
          build: 0,
          major: 0,
          minor: 0,
          type: 0,
        },
      },
    };
    this.defaultConsoleSmc = {
      avpack: 0,
      dvdmediatype: 0,
      smcversion: 'Unavailable',
      temperature: {
        celsius: false,
        max: {
          cpu: 0,
          gpu: 0,
          memory: 0,
        },
        target: {
          cpu: 0,
          gpu: 0,
          memory: 0,
        },
      },
      tiltstate: 0,
      traystate: 0,
    };
    this.defaultConsoleSystem = {
      console: {
        motherboard: 'Unavailable',
        type: 'Unavailable',
      },
      consoleid: 'Unavailable',
      cpukey: 'Unavailable',
      dvdkey: 'Unavailable',
      serial: 'Unavailable',
      version: {
        build: 0,
        major: 0,
        minor: 0,
        qfe: 0,
      },
    };
    this.defaultConsoleTemperature = {
      celsius: true,
      case: 0.0,
      cpu: 0.0,
      gpu: 0.0,
      memory: 0.0,
    };
    this.defaultConsoleThreads = [];
    this.defaultConsoleThreadState = {
      state: 0,
    };
  }

  selectConsoleConfiguration(configuration: GameConsoleConfiguration) {
    this.selectedConsole.set(new GameConsole(configuration));
  }

  deselectConsoleConfiguration() {
    this.selectedConsole.set(null);
  }

  createConsoleConfiguration(
    name: string,
    ipAddress: string,
    auroraFtpPort: number,
    auroraFtpUsername: string | null,
    auroraFtpPassword: string | null,
    auroraHttpPort: number,
    auroraHttpUsername: string | null,
    auroraHttpPassword: string | null,
  ) {
    invoke('create_game_console_configuration', {
      name: name,
      ipAddress: ipAddress,
      auroraFtpPort: auroraFtpPort,
      auroraFtpUsername: auroraFtpUsername,
      auroraFtpPassword: auroraFtpPassword,
      auroraHttpPort: auroraHttpPort,
      auroraHttpUsername: auroraHttpUsername,
      auroraHttpPassword: auroraHttpPassword,
    })
      .then((response) => {})
      .catch((error) => {
        console.error(error as string);
        this._snackBar.open('Failed to create console', '', {
          duration: 3000,
        });
      })
      .finally(() => {
        this.loadConsoleConfigurations(true);
      });
  }

  deleteConsoleConfiguration(id: string, deleteData: boolean) {
    let selectedConsole = this.selectedConsole();
    if (selectedConsole !== null && selectedConsole.configuration.id == id) {
      this.selectedConsole.set(null);
    }
    invoke('delete_game_console_configuration', {
      consoleConfigurationId: id,
      deleteData: deleteData,
    })
      .then(() => {})
      .catch((error) => {
        console.error(error as string);
        this._snackBar.open('Failed to delete console', '', {
          duration: 3000,
        });
      })
      .finally(() => {
        this.loadConsoleConfigurations(true);
      });
  }

  loadConsoleConfigurations(forceReload: boolean) {
    if (this.consoleConfigurations().length !== 0 && !forceReload) {
      return;
    }
    invoke('read_game_console_configurations')
      .then((response) => {
        this.consoleConfigurations.set(response as GameConsoleConfiguration[]);
      })
      .catch((error) => {
        console.error(error as string);
        this._snackBar.open('Failed to load console list', '', {
          duration: 3000,
        });
      });
  }

  updateConsoleConfiguration(
    id: string,
    name: string,
    ipAddress: string,
    auroraFtpPort: number,
    auroraFtpUsername: string | null,
    auroraFtpPassword: string | null,
    auroraHttpPort: number,
    auroraHttpUsername: string | null,
    auroraHttpPassword: string | null,
  ) {
    invoke('update_game_console_configuration', {
      id: id,
      name: name,
      ipAddress: ipAddress,
      auroraFtpPort: auroraFtpPort,
      auroraFtpUsername: auroraFtpUsername,
      auroraFtpPassword: auroraFtpPassword,
      auroraHttpPort: auroraHttpPort,
      auroraHttpUsername: auroraHttpUsername,
      auroraHttpPassword: auroraHttpPassword,
    })
      .then((response) => {
        let selectedConsole = this.selectedConsole();
        let responseConfig = response as GameConsoleConfiguration;
        if (
          selectedConsole !== null &&
          selectedConsole.configuration.id === responseConfig.id
        ) {
          selectedConsole.configuration = responseConfig;
        }
      })
      .catch((error) => {
        console.error(error as string);
        this._snackBar.open('Failed to update console', '', {
          duration: 3000,
        });
      })
      .finally(() => {
        this.loadConsoleConfigurations(true);
      });
  }

  avpackText(value: number) {
    let text = 'Unknown';
    switch (value) {
      case 0:
        text = 'Unknown';
        break;
      case 1:
        text = 'HDMI';
        break;
      case 2:
        text = 'Component';
        break;
      case 3:
        text = 'VGA';
        break;
      case 4:
        text = 'Composite TV';
        break;
      case 5:
        text = 'Composite HD';
        break;
      case 6:
        text = 'HDMI Audio';
        break;
      default:
        break;
    }
    return text;
  }

  dvdMediaTypeText(value: number) {
    let text = 'Unknown';
    switch (value) {
      case 0:
        text = 'None';
        break;
      case 1:
        text = 'Xbox 360';
        break;
      case 2:
        text = 'Xbox Classic';
        break;
      case 3:
        text = 'Unknown';
        break;
      case 4:
        text = 'DVD Audio';
        break;
      case 5:
        text = 'DVD Movie';
        break;
      case 6:
        text = 'CD Video';
        break;
      case 7:
        text = 'CD Audio';
        break;
      case 8:
        text = 'CD Data';
        break;
      case 9:
        text = 'Game Movie Hybrid';
        break;
      case 10:
        text = 'HD DVD';
        break;
      default:
        break;
    }
    return text;
  }

  threadStateText(value: number) {
    if (value == 0) {
      return 'Active';
    }
    if (value == 2) {
      return 'Suspended';
    }
    return 'Unknown';
  }

  tiltstateText(value: number) {
    if (value == 0) {
      return 'Vertical';
    }
    if (value == 1) {
      return 'Horizontal';
    }
    return 'Unknown';
  }

  traystateText(value: number) {
    let text = 'Unknown';
    switch (value) {
      case 0:
        text = 'Idle';
        break;
      case 1:
        text = 'Closing';
        break;
      case 2:
        text = 'Open';
        break;
      case 3:
        text = 'Opening';
        break;
      case 4:
        text = 'Closed';
        break;
      case 5:
        text = 'Error';
        break;
      default:
        break;
    }
    return text;
  }
}
