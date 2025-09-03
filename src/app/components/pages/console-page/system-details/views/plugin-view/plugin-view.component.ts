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
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';

import {
  AuroraPlugin,
  AuroraPluginFeatures,
  AuroraPluginPaths,
} from '@app/types/aurora';
import { AuroraHttpService } from '@app/services/aurora-http.service';
import { GameConsoleConfiguration } from '@app/types/app';
import { UiService } from '@app/services/ui.service';

@Component({
  selector: 'app-plugin-view',
  imports: [AsyncPipe, MatCardModule, MatChipsModule, MatListModule],
  templateUrl: './plugin-view.component.html',
  styleUrl: './plugin-view.component.sass',
})
export class PluginViewComponent implements OnInit {
  readonly #auroraHttpService = inject(AuroraHttpService);
  readonly uiService = inject(UiService);
  @Input({ required: true })
  gameConsoleConfiguration!: GameConsoleConfiguration;
  plugin: Signal<AuroraPlugin | null>;

  constructor() {
    this.plugin = signal<AuroraPlugin | null>(null);
  }

  ngOnInit() {
    this.plugin = this.#auroraHttpService.plugin(this.gameConsoleConfiguration);
    // TODO load plugin?
  }

  get apiVersionText(): string {
    return this.plugin()?.version.api.toString() ?? 'Unknown';
  }

  get pluginFeaturesText(): { key: string; value: string }[] {
    return [
      {
        key: 'Achievements',
        value: this.#pluginFeatureValueText('achievements'),
      },
      {
        key: 'Debugger',
        value: this.#pluginFeatureValueText('debugger'),
      },
      {
        key: 'Gamepad',
        value: this.#pluginFeatureValueText('gamepad'),
      },
      {
        key: 'HTTP Daemon',
        value: this.#pluginFeatureValueText('httpdaemon'),
      },
      {
        key: 'Multidisc',
        value: this.#pluginFeatureValueText('multidisc'),
      },
      {
        key: 'Network',
        value: this.#pluginFeatureValueText('network'),
      },
      {
        key: 'Systemlink',
        value: this.#pluginFeatureValueText('systemlink'),
      },
      {
        key: 'Threads',
        value: this.#pluginFeatureValueText('threads'),
      },
      {
        key: 'Trainers',
        value: this.#pluginFeatureValueText('trainers'),
      },
    ];
  }

  get pluginPathText(): { key: string; value: string }[] {
    return [
      {
        key: 'Launcher',
        value: this.plugin()?.path['launcher'] ?? 'Unknown',
      },
      {
        key: 'Root',
        value: this.plugin()?.path['root'] ?? 'Unknown',
      },
      {
        key: 'User',
        value: this.plugin()?.path['user'] ?? 'Unknown',
      },
      {
        key: 'Web',
        value: this.plugin()?.path['web'] ?? 'Unknown',
      },
    ];
  }

  get pluginVersionText(): string {
    let value = 'Unknown';
    let versionNumber = this.plugin()?.version.number;
    if (versionNumber) {
      value = `${versionNumber.major}.${versionNumber.minor}.${versionNumber.type} r${versionNumber.build}`;
    }
    return value;
  }

  // called by parent component
  update(): Promise<AuroraPlugin | null> {
    return this.#auroraHttpService.loadPlugin(this.gameConsoleConfiguration);
  }

  #pluginFeatureValueText(featureName: keyof AuroraPluginFeatures): string {
    switch (this.plugin()?.features[featureName]) {
      case 0:
        return 'No';
      case 1:
        return 'Yes';
      default:
        return 'Unknown';
    }
  }
}
