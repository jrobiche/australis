import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  Signal,
  inject,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';

import {
  AuroraMemory,
  AuroraSmc,
  AuroraSystem,
  AuroraTemperature,
} from '@app/types/aurora';
import { AuroraHttpService } from '@app/services/aurora-http.service';
import { GameConsoleConfiguration } from '@app/types/app';
import { UiService } from '@app/services/ui.service';

@Component({
  selector: 'app-dashboard-view',
  imports: [AsyncPipe, MatCardModule, MatExpansionModule, MatListModule],
  templateUrl: './dashboard-view.component.html',
  styleUrl: './dashboard-view.component.sass',
})
export class DashboardViewComponent implements OnInit {
  readonly #auroraHttpService = inject(AuroraHttpService);
  readonly uiService = inject(UiService);
  @Input({ required: true })
  gameConsoleConfiguration!: GameConsoleConfiguration;
  memory: Signal<AuroraMemory | null>;
  smc: Signal<AuroraSmc | null>;
  system: Signal<AuroraSystem | null>;
  temperature: Signal<AuroraTemperature | null>;

  constructor() {
    this.memory = signal<AuroraMemory | null>(null);
    this.smc = signal<AuroraSmc | null>(null);
    this.system = signal<AuroraSystem | null>(null);
    this.temperature = signal<AuroraTemperature | null>(null);
  }

  ngOnInit() {
    this.memory = this.#auroraHttpService.memory(this.gameConsoleConfiguration);
    this.smc = this.#auroraHttpService.smc(this.gameConsoleConfiguration);
    this.system = this.#auroraHttpService.system(this.gameConsoleConfiguration);
    this.temperature = this.#auroraHttpService.temperature(
      this.gameConsoleConfiguration,
    );
    // TODO load memory, smc, system, and temperature?
  }

  get avPackText(): string {
    switch (this.smc()?.avpack) {
      case 0:
        return 'Unknown';
      case 1:
        return 'HDMI';
      case 2:
        return 'Component';
      case 3:
        return 'VGA';
      case 4:
        return 'Composite TV';
      case 5:
        return 'Composite HD';
      case 6:
        return 'HDMI Audio';
      default:
        return 'Unknown';
    }
  }

  get consoleIdText(): string {
    return this.system()?.consoleid ?? 'Unknown';
  }

  get cpuKeyText(): string {
    return this.system()?.cpukey ?? 'Unknown';
  }

  get dashboardText(): string {
    let value = 'Unknown';
    let version = this.system()?.version;
    if (version) {
      value = `${version.major}.${version.minor}.${version.build}.${version.qfe}`;
    }
    return value;
  }

  get dvdKeyText(): string {
    return this.system()?.dvdkey ?? 'Unknown';
  }

  get dvdMediaTypeText(): string {
    switch (this.smc()?.dvdmediatype) {
      case 0:
        return 'None';
      case 1:
        return 'Xbox 360';
      case 2:
        return 'Xbox Classic';
      case 3:
        return 'Unknown';
      case 4:
        return 'DVD Audio';
      case 5:
        return 'DVD Movie';
      case 6:
        return 'CD Video';
      case 7:
        return 'CD Audio';
      case 8:
        return 'CD Data';
      case 9:
        return 'Game Movie Hybrid';
      case 10:
        return 'HD DVD';
      default:
        return 'Unknown';
    }
  }

  get memoryText(): string {
    let value = 'Unknown';
    let memory = this.memory();
    if (memory != null) {
      let used = memory.used / (1024 * 1024);
      let total = memory.total / (1024 * 1024);
      let free = memory.free / (1024 * 1024);
      value = `${used.toFixed(1)}MB/${total.toFixed(0)}MB (${free.toFixed(1)}MB free)`;
    }
    return value;
  }

  get motherboardText(): string {
    let value = 'Unknown';
    let systemConsole = this.system()?.console;
    if (systemConsole) {
      value = `${systemConsole.motherboard} (${systemConsole.type})`;
    }
    return value;
  }

  get serialText(): string {
    return this.system()?.serial ?? 'Unknown';
  }

  get smcText(): string {
    return this.smc()?.smcversion ?? 'Unknown';
  }

  get tiltStateText(): string {
    switch (this.smc()?.tiltstate) {
      case 0:
        return 'Vertical';
      case 1:
        return 'Horizontal';
      default:
        return 'Unknown';
    }
  }

  get trayStateText(): string {
    switch (this.smc()?.traystate) {
      case 0:
        return 'Idle';
      case 1:
        return 'Closing';
      case 2:
        return 'Open';
      case 3:
        return 'Opening';
      case 4:
        return 'Closed';
      case 5:
        return 'Error';
      default:
        return 'Unknown';
    }
  }

  temperatureText(component: string): string {
    let value = 'Unknown';
    let temperature = this.temperature();
    if (temperature != null) {
      switch (component) {
        case 'case':
          value = `${temperature.case.toFixed(1)}${this.temperatureUnitText(temperature)}`;
          break;
        case 'cpu':
          value = `${temperature.cpu.toFixed(1)}${this.temperatureUnitText(temperature)}`;
          break;
        case 'gpu':
          value = `${temperature.gpu.toFixed(1)}${this.temperatureUnitText(temperature)}`;
          break;
        case 'ram':
          value = `${temperature.memory.toFixed(1)}${this.temperatureUnitText(temperature)}`;
          break;
        default:
          value = 'Invalid';
          break;
      }
    }
    return value;
  }

  temperatureUnitText(temperature: AuroraTemperature): string {
    switch (temperature.celsius) {
      case true:
        return '°C';
      case false:
        return '°F';
      default:
        return '';
    }
  }

  // called by parent component
  async update(): Promise<void> {
    await this.#auroraHttpService.loadTemperature(
      this.gameConsoleConfiguration,
    );
    await this.#auroraHttpService.loadMemory(this.gameConsoleConfiguration);
    await this.#auroraHttpService.loadSmc(this.gameConsoleConfiguration);
    await this.#auroraHttpService.loadSystem(this.gameConsoleConfiguration);
    return Promise.resolve();
  }
}
