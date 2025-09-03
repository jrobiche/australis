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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';

import { AuroraDashlaunch, AuroraDashlaunchOption } from '@app/types/aurora';
import { AuroraHttpService } from '@app/services/aurora-http.service';
import { GameConsoleConfiguration } from '@app/types/app';
import { UiService } from '@app/services/ui.service';

@Component({
  selector: 'app-dashlaunch-view',
  imports: [
    AsyncPipe,
    MatCardModule,
    MatChipsModule,
    MatExpansionModule,
    MatListModule,
  ],
  templateUrl: './dashlaunch-view.component.html',
  styleUrl: './dashlaunch-view.component.sass',
})
export class DashlaunchViewComponent implements OnInit {
  readonly #auroraHttpService = inject(AuroraHttpService);
  readonly uiService = inject(UiService);
  @Input({ required: true })
  gameConsoleConfiguration!: GameConsoleConfiguration;
  dashlaunch: Signal<AuroraDashlaunch | null>;

  constructor() {
    this.dashlaunch = signal<AuroraDashlaunch | null>(null);
  }

  ngOnInit() {
    this.dashlaunch = this.#auroraHttpService.dashlaunch(
      this.gameConsoleConfiguration,
    );
    // TODO load dashlaunch?
  }

  get behaviorOptions(): AuroraDashlaunchOption[] {
    return this.#optionsByCategory('Behavior');
  }

  get configuratorOptions(): AuroraDashlaunchOption[] {
    return this.#optionsByCategory('Extern');
  }

  get kernelText(): string {
    return this.dashlaunch()?.version.kernel.toString() ?? 'Unknown';
  }

  get networkOptions(): AuroraDashlaunchOption[] {
    return this.#optionsByCategory('Net');
  }

  get pathOptions(): AuroraDashlaunchOption[] {
    return this.#optionsByCategory('Paths');
  }

  get pluginOptions(): AuroraDashlaunchOption[] {
    return this.#optionsByCategory('Plugins');
  }

  get timerOptions(): AuroraDashlaunchOption[] {
    return this.#optionsByCategory('Timer');
  }

  get versionText(): string {
    let value = 'Unknown';
    let versionNumber = this.dashlaunch()?.version.number ?? null;
    if (versionNumber) {
      value = `${versionNumber.major}.${versionNumber.minor} (${versionNumber.build})`;
    }
    return value;
  }

  update(): Promise<AuroraDashlaunch | null> {
    return this.#auroraHttpService.loadDashlaunch(
      this.gameConsoleConfiguration,
    );
  }

  #optionsByCategory(category: string): AuroraDashlaunchOption[] {
    let options =
      this.dashlaunch()?.options.filter(
        (option) => option.category == category,
      ) ?? [];
    options.forEach((e, i) => {
      if (e.value === '') {
        e.value = '(none)';
      }
    });
    return options;
  }
}
