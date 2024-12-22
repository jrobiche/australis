import { invoke } from '@tauri-apps/api/core';

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

export class GameConsole {
  private _authenticationToken: string | null;
  configuration: GameConsoleConfiguration;

  constructor(configuration: GameConsoleConfiguration) {
    this.configuration = configuration;
    this._authenticationToken = null;
  }

  private _requestAuthenticationToken(): Promise<string> {
    return invoke('http_get_console_authentication_token', {
      consoleConfiguration: this.configuration,
    });
  }

  authenticate(): Promise<boolean> {
    if (this.isAuthenticated()) {
      return Promise.resolve(true);
    }
    return this._requestAuthenticationToken()
      .then((response) => {
        this._authenticationToken = response as string;
        return true;
      })
      .catch((error) => {
        console.error(
          'Failed to authenticate with console. Got the following error:',
          error,
        );
        return false;
      });
  }

  isAuthenticated(): boolean {
    return this._authenticationToken !== null;
  }

  logout(): void {
    this._authenticationToken = null;
  }

  requestMemory(): Promise<ConsoleMemory> {
    if (!this.isAuthenticated()) {
      return Promise.reject(
        new Error('Must be authenticated to request console memory.'),
      );
    }
    return invoke('http_get_console_memory', {
      consoleConfiguration: this.configuration,
      token: this._authenticationToken,
    });
  }

  requestPlugin(): Promise<ConsolePlugin> {
    if (!this.isAuthenticated()) {
      return Promise.reject(
        new Error('Must be authenticated to request console plugin.'),
      );
    }
    return invoke('http_get_console_plugin', {
      consoleConfiguration: this.configuration,
      token: this._authenticationToken,
    });
  }

  requestSmc(): Promise<ConsoleSmc> {
    if (!this.isAuthenticated()) {
      return Promise.reject(
        new Error('Must be authenticated to request console smc.'),
      );
    }
    return invoke('http_get_console_smc', {
      consoleConfiguration: this.configuration,
      token: this._authenticationToken,
    });
  }

  requestSystem(): Promise<ConsoleSystem> {
    if (!this.isAuthenticated()) {
      return Promise.reject(
        new Error('Must be authenticated to request console system.'),
      );
    }
    return invoke('http_get_console_system', {
      consoleConfiguration: this.configuration,
      token: this._authenticationToken,
    });
  }

  requestTemperature(): Promise<ConsoleTemperature> {
    if (!this.isAuthenticated()) {
      return Promise.reject(
        new Error('Must be authenticated to request console temperature.'),
      );
    }
    return invoke('http_get_console_temperature', {
      consoleConfiguration: this.configuration,
      token: this._authenticationToken,
    });
  }

  requestThreads(): Promise<ConsoleThread[]> {
    if (!this.isAuthenticated()) {
      return Promise.reject(
        new Error('Must be authenticated to request console threads.'),
      );
    }
    return invoke('http_get_console_thread', {
      consoleConfiguration: this.configuration,
      token: this._authenticationToken,
    });
  }

  requestThreadState(): Promise<ConsoleThreadState> {
    if (!this.isAuthenticated()) {
      return Promise.reject(
        new Error('Must be authenticated to request console thread state.'),
      );
    }
    return invoke('http_get_console_thread_state', {
      consoleConfiguration: this.configuration,
      token: this._authenticationToken,
    });
  }

  requestSetThreadState(suspended: boolean): Promise<void> {
    if (!this.isAuthenticated()) {
      return Promise.reject(
        new Error('Must be authenticated to request console thread state.'),
      );
    }
    return invoke('http_post_console_thread_state', {
      consoleConfiguration: this.configuration,
      token: this._authenticationToken,
      suspend: suspended,
    });
  }
}
