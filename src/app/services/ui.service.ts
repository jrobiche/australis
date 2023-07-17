import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/tauri';
import { Observable, Subject } from 'rxjs';
import { GameConsoleConfiguration } from '../interfaces/game-console-configuration';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private gameConsoleConfigurations: GameConsoleConfiguration[];
  gameConsoleConfigurationsSubject: Subject<GameConsoleConfiguration[]>;
  private selectedGameConsoleConfiguration: GameConsoleConfiguration | null;
  selectedGameConsoleConfigurationSubject: Subject<GameConsoleConfiguration | null>;

  constructor() {
    this.gameConsoleConfigurations = [];
    this.gameConsoleConfigurationsSubject = new Subject<
      GameConsoleConfiguration[]
    >();
    this.selectedGameConsoleConfiguration = null;
    this.selectedGameConsoleConfigurationSubject =
      new Subject<GameConsoleConfiguration | null>();
  }

  private loadGameConsoleConfigurations(): void {
    invoke('get_game_console_configurations')
      .then((response: any) => {
        this.setGameConsoleConfigurations(
          response as GameConsoleConfiguration[]
        );
      })
      .catch((err) => {
        console.error(
          'Failed to load game console configurations. Error:',
          err
        );
      });
  }

  createGameConsoleConfiguration(
    name: string,
    ipAddress: string,
    auroraFtpPort: number,
    auroraFtpUsername: string | null,
    auroraFtpPassword: string | null,
    auroraHttpPort: number,
    auroraHttpUsername: string | null,
    auroraHttpPassword: string | null
  ): Promise<GameConsoleConfiguration> {
    let data = {
      name: name,
      ipAddress: ipAddress,
      auroraFtpPort: auroraFtpPort,
      auroraFtpUsername: auroraFtpUsername,
      auroraFtpPassword: auroraFtpPassword,
      auroraHttpPort: auroraHttpPort,
      auroraHttpUsername: auroraHttpUsername,
      auroraHttpPassword: auroraHttpPassword,
    };
    return new Promise((resolve, reject) => {
      invoke('create_game_console_configuration', data)
        .then((response: any) => {
          this.loadGameConsoleConfigurations();
          resolve(response as GameConsoleConfiguration);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  updateGameConsoleConfiguration(
    id: number,
    name: string,
    ipAddress: string,
    auroraFtpPort: number,
    auroraFtpUsername: string | null,
    auroraFtpPassword: string | null,
    auroraHttpPort: number,
    auroraHttpUsername: string | null,
    auroraHttpPassword: string | null
  ): Promise<GameConsoleConfiguration> {
    let data = {
      id: id,
      name: name,
      ipAddress: ipAddress,
      auroraFtpPort: auroraFtpPort,
      auroraFtpUsername: auroraFtpUsername,
      auroraFtpPassword: auroraFtpPassword,
      auroraHttpPort: auroraHttpPort,
      auroraHttpUsername: auroraHttpUsername,
      auroraHttpPassword: auroraHttpPassword,
    };
    return new Promise((resolve, reject) => {
      invoke('update_game_console_configuration', data)
        .then((response: any) => {
          let updatedGameConsoleConfiguration =
            response as GameConsoleConfiguration;
          if (
            this.selectedGameConsoleConfiguration !== null &&
            this.selectedGameConsoleConfiguration.id ===
              updatedGameConsoleConfiguration.id
          ) {
            // select the new configuration in case it was modified
            this.setSelectedGameConsoleConfiguration(
              updatedGameConsoleConfiguration
            );
          }
          this.loadGameConsoleConfigurations();
          resolve(updatedGameConsoleConfiguration);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  deleteGameConsoleConfiguration(
    gameConsoleConfigurationId: number
  ): Promise<GameConsoleConfiguration> {
    if (
      this.selectedGameConsoleConfiguration !== null &&
      this.selectedGameConsoleConfiguration.id === gameConsoleConfigurationId
    ) {
      this.setSelectedGameConsoleConfiguration(null);
    }
    return new Promise((resolve, reject) => {
      invoke('delete_game_console_configuration', {
        id: gameConsoleConfigurationId,
      })
        .then((response: any) => {
          this.loadGameConsoleConfigurations();
          resolve(response as GameConsoleConfiguration);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  getGameConsoleConfigurations(): GameConsoleConfiguration[] {
    this.loadGameConsoleConfigurations();
    return this.gameConsoleConfigurations;
  }

  onGameConsoleConfigurationsChange(): Observable<GameConsoleConfiguration[]> {
    return this.gameConsoleConfigurationsSubject.asObservable();
  }

  private setGameConsoleConfigurations(
    gameConsoleConfigurations: GameConsoleConfiguration[]
  ): void {
    this.gameConsoleConfigurations = gameConsoleConfigurations;
    this.gameConsoleConfigurationsSubject.next(this.gameConsoleConfigurations);
  }

  getSelectedGameConsoleConfiguration(): GameConsoleConfiguration | null {
    return this.selectedGameConsoleConfiguration;
  }

  setSelectedGameConsoleConfiguration(
    gameConsoleConfiguration: GameConsoleConfiguration | null
  ): void {
    this.selectedGameConsoleConfiguration = gameConsoleConfiguration;
    this.selectedGameConsoleConfigurationSubject.next(
      this.selectedGameConsoleConfiguration
    );
  }

  sortGameConsoleConfigurationsByName(
    a: GameConsoleConfiguration,
    b: GameConsoleConfiguration
  ): number {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }

  onSelectedGameConsoleConfigurationChange(): Observable<GameConsoleConfiguration | null> {
    return this.selectedGameConsoleConfigurationSubject.asObservable();
  }
}
