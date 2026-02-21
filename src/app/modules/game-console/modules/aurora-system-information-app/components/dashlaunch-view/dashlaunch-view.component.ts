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

import { AuroraStateService } from '@app/modules/aurora/services/aurora-state.service';
import {
  AuroraDashlaunch,
  AuroraDashlaunchOption,
} from '@app/modules/aurora/types/aurora';
import { PageTitleToolbarComponent } from '@app/shared/components/page-title-toolbar/page-title-toolbar.component';
import { ResponsiveWidthContainerComponent } from '@app/shared/components/responsive-width-container/responsive-width-container.component';
import { BreakpointService } from '@app/shared/services/breakpoint.service';
import { GameConsoleConfiguration } from '@app/shared/types/app';

@Component({
  selector: 'app-dashlaunch-view',
  imports: [
    AsyncPipe,
    MatCardModule,
    MatChipsModule,
    MatExpansionModule,
    MatListModule,
    PageTitleToolbarComponent,
    ResponsiveWidthContainerComponent,
  ],
  templateUrl: './dashlaunch-view.component.html',
  styleUrl: './dashlaunch-view.component.sass',
})
export class DashlaunchViewComponent implements OnInit {
  readonly #auroraState = inject(AuroraStateService);
  readonly breakpoint = inject(BreakpointService);
  @Input({ required: true })
  gameConsoleConfiguration!: GameConsoleConfiguration;
  dashlaunch: Signal<AuroraDashlaunch | null>;

  constructor() {
    this.dashlaunch = signal<AuroraDashlaunch | null>(null);
  }

  ngOnInit() {
    this.dashlaunch = this.#auroraState.dashlaunch(
      this.gameConsoleConfiguration,
    );
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
    return this.#auroraState.loadDashlaunch(this.gameConsoleConfiguration);
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
