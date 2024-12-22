import { Component, OnDestroy, Signal, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogData } from '../../interfaces/confirmation-dialog-data';
import { CreateUpdateConsoleDialogComponent } from '../create-update-console-dialog/create-update-console-dialog.component';
import { GameConsole } from '../../classes/game-console';
import {
  ConsoleMemory,
  ConsolePlugin,
  ConsoleSmc,
  ConsoleSystem,
  ConsoleTemperature,
  ConsoleThread,
  ConsoleThreadState,
} from '../../interfaces/aurora-http-schemas';
import { GameConsoleConfiguration } from '../../interfaces/game-console-configuration';
import { UiService } from '../../services/ui.service';

interface TemperatureTableElement {
  component: string;
  live: string;
  target: string;
  max: string;
}

@Component({
  selector: 'app-console-dashboard',
  imports: [
    DecimalPipe,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatToolbarModule,
  ],
  templateUrl: './console-dashboard.component.html',
  styleUrl: './console-dashboard.component.sass',
})
export class ConsoleDashboardComponent implements OnDestroy {
  private readonly _dialog = inject(MatDialog);
  private readonly _snackBar = inject(MatSnackBar);
  private readonly _uiService = inject(UiService);
  private _consoleMemory: ConsoleMemory | null;
  private _consolePlugin: ConsolePlugin | null;
  private _consoleSmc: ConsoleSmc | null;
  private _consoleSystem: ConsoleSystem | null;
  private _consoleTemperature: ConsoleTemperature | null;
  private _consoleThreads: ConsoleThread[] | null;
  private _consoleThreadState: ConsoleThreadState | null;
  private _requestCount: number;
  private _requestFailureCount: number;
  private _maxRequestFailureCount: number;
  private _intervalId: number;
  displayedTemperaturesColumns: string[];
  displayedThreadsColumns: string[];
  isLoading: boolean;

  constructor() {
    this._consoleMemory = null;
    this._consolePlugin = null;
    this._consoleSmc = null;
    this._consoleSystem = null;
    this._consoleTemperature = null;
    this._consoleThreads = null;
    this._consoleThreadState = null;
    this._requestCount = 0;
    this._requestFailureCount = 0;
    this._maxRequestFailureCount =
      this._uiService.consoleRequestMaxFailureCount;
    this._intervalId = setInterval(
      this.initializeConsoleInformation,
      this._uiService.consoleRequestRate,
      this,
    );
    this.displayedTemperaturesColumns = ['component', 'live', 'target', 'max'];
    this.displayedThreadsColumns = [
      'address',
      'flags',
      'id',
      'priority',
      'state',
      'type',
    ];
    this.isLoading = true;
  }

  ngOnDestroy() {
    clearInterval(this._intervalId);
  }

  get consoleConfigurationName(): string {
    return (
      this._uiService.selectedConsole()?.configuration.name ?? 'Unavailable'
    );
  }

  get memory(): ConsoleMemory {
    return this._consoleMemory ?? this._uiService.defaultConsoleMemory;
  }

  get plugin(): ConsolePlugin {
    return this._consolePlugin ?? this._uiService.defaultConsolePlugin;
  }

  get smc(): ConsoleSmc {
    return this._consoleSmc ?? this._uiService.defaultConsoleSmc;
  }

  get system(): ConsoleSystem {
    return this._consoleSystem ?? this._uiService.defaultConsoleSystem;
  }

  get temperature(): ConsoleTemperature {
    return (
      this._consoleTemperature ?? this._uiService.defaultConsoleTemperature
    );
  }

  get temperatureTableData(): TemperatureTableElement[] {
    // component, live, target, max
    let temperature = this.temperature;
    let smc = this.smc;
    let tableData: TemperatureTableElement[] = [];
    let temperatureUnit = temperature.celsius ? 'C' : 'F';
    let smcTemperatureUnit = smc.temperature.celsius ? 'C' : 'F';
    // CPU data
    tableData.push({
      component: 'CPU',
      live: `${temperature.cpu}\xB0${temperatureUnit}`,
      target: `${smc.temperature.target.cpu}\xB0${smcTemperatureUnit}`,
      max: `${smc.temperature.max.cpu}\xB0${smcTemperatureUnit}`,
    });
    // RAM data
    tableData.push({
      component: 'RAM',
      live: `${temperature.memory}\xB0${temperatureUnit}`,
      target: `${smc.temperature.target.memory}\xB0${smcTemperatureUnit}`,
      max: `${smc.temperature.max.memory}\xB0${smcTemperatureUnit}`,
    });
    // GPU data
    tableData.push({
      component: 'GPU',
      live: `${temperature.gpu}\xB0${temperatureUnit}`,
      target: `${smc.temperature.target.gpu}\xB0${smcTemperatureUnit}`,
      max: `${smc.temperature.max.gpu}\xB0${smcTemperatureUnit}`,
    });
    // Case data
    tableData.push({
      component: 'Case',
      live: `${temperature.case}\xB0${temperatureUnit}`,
      target: '--',
      max: '--',
    });
    return tableData;
  }

  get threads(): ConsoleThread[] {
    return this._consoleThreads ?? this._uiService.defaultConsoleThreads;
  }

  get threadsTableData(): ConsoleThread[] {
    return this._consoleThreads ?? this._uiService.defaultConsoleThreads;
  }

  get threadState(): ConsoleThreadState {
    return (
      this._consoleThreadState ?? this._uiService.defaultConsoleThreadState
    );
  }

  get avpackText(): string {
    return this._uiService.avpackText(this.smc.avpack);
  }

  get dvdmediatypeText(): string {
    return this._uiService.dvdMediaTypeText(this.smc.dvdmediatype);
  }

  get threadStateText(): string {
    return this._uiService.threadStateText(this.threadState.state);
  }

  get tiltstateText(): string {
    return this._uiService.tiltstateText(this.smc.tiltstate);
  }

  get traystateText(): string {
    return this._uiService.traystateText(this.smc.traystate);
  }

  bytesToMegaBytes(bytes: number): number {
    return bytes / (1024 * 1024);
  }

  getPluginFeatureIcon(value: number): string {
    if (value == 1) {
      return 'check';
    }
    return 'close';
  }

  async initializeConsoleInformation(scope: any) {
    /**
     * this function should be called in an interval.
     * only one request to the console should be made each time this function
     * is called in order to resolve the issue where making too many requests
     * at the same time will result in HTTP request errors.
     */
    // verify selected console is not null
    let selectedConsole = scope._uiService.selectedConsole();
    if (selectedConsole === null) {
      scope.handleInvalidConsole();
      return;
    }
    // verify the console has not made too many consecutive failed requests
    if (scope._requestFailureCount >= scope._maxRequestFailureCount) {
      scope.handleTooManyFailedRequests();
      return;
    }
    // verify that we have successfully authenticated with the console
    if (!selectedConsole.isAuthenticated()) {
      scope.handleAuthenticationRequest(selectedConsole.authenticate());
      return;
    }
    // initialize static information
    if (scope._consoleSystem === null) {
      scope.handleSystemRequest(selectedConsole.requestSystem());
      return;
    }
    if (scope._consolePlugin === null) {
      scope.handlePluginRequest(selectedConsole.requestPlugin());
      return;
    }
    scope.handleConsoleInformationInitialized();
  }

  async updateConsoleInformation(scope: any) {
    /**
     * this function should be called in an interval.
     * only one request to the console should be made each time this function
     * is called in order to resolve the issue where making too many requests
     * at the same time will result in HTTP request errors.
     */
    // verify selected console is not null
    let selectedConsole = scope._uiService.selectedConsole();
    if (selectedConsole === null) {
      scope.handleInvalidConsole();
      return;
    }
    // verify the console has not made too many consecutive failed requests
    if (scope._requestFailureCount >= scope._maxRequestFailureCount) {
      scope.handleTooManyFailedRequests();
      return;
    }
    // verify that we have successfully authenticated with the console
    if (!selectedConsole.isAuthenticated()) {
      scope.handleAuthenticationRequest(selectedConsole.authenticate());
      return;
    }
    // continuously update dynamic information
    // use the value of `_requestCount` to determine
    // which request should be made
    switch (scope._requestCount) {
      case 1:
        scope.handleSmcRequest(selectedConsole.requestSmc());
        break;
      case 2:
        scope.handleTemperatureRequest(selectedConsole.requestTemperature());
        break;
      case 3:
        scope.handleMemoryRequest(selectedConsole.requestMemory());
        break;
      case 4:
        scope.handleThreadsRequest(selectedConsole.requestThreads());
        break;
      case 5:
        scope.handleThreadStateRequest(selectedConsole.requestThreadState());
        scope._requestCount = 0;
        break;
      default:
        scope._requestCount = 0;
    }
    scope._requestCount += 1;
  }

  onBackClick() {
    this._uiService.deselectConsoleConfiguration();
  }

  onReloadConsoleInformationClick() {
    clearInterval(this._intervalId);
    this.isLoading = true;
    this._requestCount = 0;
    this._requestFailureCount = 0;
    this._consoleMemory = null;
    this._consolePlugin = null;
    this._consoleSmc = null;
    this._consoleSystem = null;
    this._consoleTemperature = null;
    this._consoleThreads = null;
    this._consoleThreadState = null;
    this._intervalId = setInterval(
      this.initializeConsoleInformation,
      this._uiService.consoleRequestRate,
      this,
    );
  }

  onResumeThreadClick() {
    let selectedConsole = this._uiService.selectedConsole();
    if (selectedConsole === null) {
      return;
    }
    selectedConsole.requestSetThreadState(false).catch((error: any) => {
      console.error('Failed to resume thread. Got the following error:', error);
      this._snackBar.open('Failed to resume thread', '', {
        duration: 3000,
      });
    });
  }

  onSuspendThreadClick() {
    let selectedConsole = this._uiService.selectedConsole();
    if (selectedConsole === null) {
      return;
    }
    selectedConsole.requestSetThreadState(true).catch((error: any) => {
      console.error(
        'Failed to suspend thread. Got the following error:',
        error,
      );
      this._snackBar.open('Failed to suspend thread', '', {
        duration: 3000,
      });
    });
  }

  // TODO allow user to specify whether or not they want to delete data
  openDeleteConsoleConfigurationDialog() {
    let selectedConsole = this._uiService.selectedConsole();
    if (selectedConsole === null) {
      return;
    }
    let dialogData: ConfirmationDialogData = {
      title: 'Delete Console',
      bodyParagraphs: [
        `Delete console named '${selectedConsole.configuration.name}'?`,
        'Warning: This will delete all local data for the console.',
      ],
      confirmButtonText: 'Delete',
    };
    this._dialog
      .open(ConfirmationDialogComponent, { data: dialogData })
      .afterClosed()
      .subscribe((result) => {
        if (result !== undefined && result === true) {
          this._uiService.deleteConsoleConfiguration(
            selectedConsole.configuration.id,
            true,
          );
        }
      });
  }

  openUpdateConsoleConfigurationDialog() {
    let selectedConsole = this._uiService.selectedConsole();
    if (selectedConsole === null) {
      return;
    }
    this._dialog
      .open(CreateUpdateConsoleDialogComponent, {
        data: selectedConsole.configuration,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result !== undefined) {
          let consoleConfig = result as GameConsoleConfiguration;
          this._uiService.updateConsoleConfiguration(
            selectedConsole.configuration.id,
            consoleConfig.name,
            consoleConfig.ipAddress,
            consoleConfig.auroraFtpPort,
            consoleConfig.auroraFtpUsername,
            consoleConfig.auroraFtpPassword,
            consoleConfig.auroraHttpPort,
            consoleConfig.auroraHttpUsername,
            consoleConfig.auroraHttpPassword,
          );
        }
      });
  }

  handleAuthenticationRequest(response: Promise<boolean>) {
    response
      .then((isAuthenticated: boolean) => {
        if (isAuthenticated) {
          this._requestFailureCount = 0;
        } else {
          // treat unauthenticated response as a failed request
          this._requestFailureCount += 1;
        }
      })
      .catch((error: any) => {
        console.error(
          'Failed to request authentication. Got the following error:',
          error,
        );
        this._requestFailureCount += 1;
      });
  }

  handleConsoleInformationInitialized() {
    this.isLoading = false;
    // clear the initialize console information interval
    clearInterval(this._intervalId);
    // create an update console information interval
    this._intervalId = setInterval(
      this.updateConsoleInformation,
      this._uiService.consoleRequestRate,
      this,
    );
  }

  handleInvalidConsole() {
    clearInterval(this._intervalId);
    this._snackBar.open('Invalid console configuration', '', {
      duration: 3000,
    });
    this._uiService.deselectConsoleConfiguration();
  }

  handleMemoryRequest(response: Promise<ConsoleMemory>) {
    response
      .then((value: ConsoleMemory) => {
        this._consoleMemory = value;
        this._requestFailureCount = 0;
      })
      .catch((error: any) => {
        console.error(
          'Failed to request memory. Got the following error:',
          error,
        );
        this._requestFailureCount += 1;
      });
  }

  handlePluginRequest(response: Promise<ConsolePlugin>) {
    response
      .then((value: ConsolePlugin) => {
        this._consolePlugin = value;
        this._requestFailureCount = 0;
      })
      .catch((error: any) => {
        console.error(
          'Failed to request plugin. Got the following error:',
          error,
        );
        this._requestFailureCount += 1;
      });
  }

  handleSmcRequest(response: Promise<ConsoleSmc>) {
    response
      .then((value: ConsoleSmc) => {
        this._consoleSmc = value;
        this._requestFailureCount = 0;
      })
      .catch((error: any) => {
        console.error('Failed to request smc. Got the following error:', error);
        this._requestFailureCount += 1;
      });
  }

  handleSystemRequest(response: Promise<ConsoleSystem>) {
    response
      .then((value: ConsoleSystem) => {
        this._consoleSystem = value;
        this._requestFailureCount = 0;
      })
      .catch((error: any) => {
        console.error(
          'Failed to request system. Got the following error:',
          error,
        );
        this._requestFailureCount += 1;
      });
  }

  handleTemperatureRequest(response: Promise<ConsoleTemperature>) {
    response
      .then((value: ConsoleTemperature) => {
        this._consoleTemperature = value;
        this._requestFailureCount = 0;
      })
      .catch((error: any) => {
        console.error(
          'Failed to request temperature. Got the following error:',
          error,
        );
        this._requestFailureCount += 1;
      });
  }

  handleThreadsRequest(response: Promise<ConsoleThread[]>) {
    response
      .then((value: ConsoleThread[]) => {
        this._consoleThreads = value;
        this._requestFailureCount = 0;
      })
      .catch((error: any) => {
        console.error(
          'Failed to request threads. Got the following error:',
          error,
        );
        this._requestFailureCount += 1;
      });
  }

  handleThreadStateRequest(response: Promise<ConsoleThreadState>) {
    response
      .then((value: ConsoleThreadState) => {
        this._consoleThreadState = value;
        this._requestFailureCount = 0;
      })
      .catch((error: any) => {
        console.error(
          'Failed to request thread state. Got the following error:',
          error,
        );
        this._requestFailureCount += 1;
      });
  }

  handleTooManyFailedRequests() {
    clearInterval(this._intervalId);
    this.isLoading = false;
    this._snackBar.open('Failed to communicate with console', 'Close');
  }
}
