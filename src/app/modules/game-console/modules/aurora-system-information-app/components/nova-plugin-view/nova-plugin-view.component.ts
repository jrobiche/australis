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

import { AuroraStateService } from '@app/modules/aurora/services/aurora-state.service';
import {
  AuroraPlugin,
  AuroraPluginFeatures,
  AuroraPluginPaths,
} from '@app/modules/aurora/types/aurora';
import { PageTitleToolbarComponent } from '@app/shared/components/page-title-toolbar/page-title-toolbar.component';
import { ResponsiveWidthContainerComponent } from '@app/shared/components/responsive-width-container/responsive-width-container.component';
import { BreakpointService } from '@app/shared/services/breakpoint.service';
import { GameConsoleConfiguration } from '@app/shared/types/app';

@Component({
  selector: 'app-nova-plugin-view',
  imports: [
    AsyncPipe,
    MatCardModule,
    MatChipsModule,
    MatListModule,
    PageTitleToolbarComponent,
    ResponsiveWidthContainerComponent,
  ],
  templateUrl: './nova-plugin-view.component.html',
  styleUrl: './nova-plugin-view.component.sass',
})
export class NovaPluginViewComponent implements OnInit {
  readonly #auroraState = inject(AuroraStateService);
  readonly breakpoint = inject(BreakpointService);
  @Input({ required: true })
  gameConsoleConfiguration!: GameConsoleConfiguration;
  plugin: Signal<AuroraPlugin | null>;

  constructor() {
    this.plugin = signal<AuroraPlugin | null>(null);
  }

  ngOnInit() {
    this.plugin = this.#auroraState.plugin(this.gameConsoleConfiguration);
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
    return this.#auroraState.loadPlugin(this.gameConsoleConfiguration);
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
