import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  Signal,
  inject,
  signal,
} from '@angular/core';

import { AuroraStateService } from '@app/modules/aurora/services/aurora-state.service';
import { AuroraScreencaptureMeta } from '@app/modules/aurora/types/aurora';
import { PageTitleToolbarComponent } from '@app/shared/components/page-title-toolbar/page-title-toolbar.component';
import { BreakpointService } from '@app/shared/services/breakpoint.service';
import { GameConsoleConfiguration } from '@app/shared/types/app';
import { ScreencapturesCardComponent } from '../screencaptures-card/screencaptures-card.component';

@Component({
  selector: 'app-game-screenshots-view',
  imports: [AsyncPipe, ScreencapturesCardComponent, PageTitleToolbarComponent],
  templateUrl: './game-screenshots-view.component.html',
  styleUrl: './game-screenshots-view.component.sass',
})
export class GameScreenshotsViewComponent implements OnInit {
  readonly #auroraState = inject(AuroraStateService);
  readonly breakpoint = inject(BreakpointService);
  @Input({ required: true })
  gameConsoleConfiguration!: GameConsoleConfiguration;
  screenCaptureMetas: Signal<AuroraScreencaptureMeta[]>;

  constructor() {
    this.screenCaptureMetas = signal<AuroraScreencaptureMeta[]>([]);
  }

  ngOnInit() {
    this.screenCaptureMetas =
      this.#auroraState.activeTitleScreencaptureMetasSorted(
        this.gameConsoleConfiguration,
      );
  }

  // called by parent component
  update(): Promise<AuroraScreencaptureMeta[] | null> {
    return this.#auroraState.loadActiveTitleScreencaptureMetas(
      this.gameConsoleConfiguration,
    );
  }
}
