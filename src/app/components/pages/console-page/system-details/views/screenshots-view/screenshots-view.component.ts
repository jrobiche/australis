import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  Signal,
  inject,
  signal,
} from '@angular/core';

import { AuroraHttpService } from '@app/services/aurora-http.service';
import { AuroraScreencaptureMeta } from '@app/types/aurora';
import { GameConsoleConfiguration } from '@app/types/app';
import { ScreencapturesCardComponent } from '@app/components/cards/screencaptures-card/screencaptures-card.component';
import { UiService } from '@app/services/ui.service';

@Component({
  selector: 'app-screenshots-view',
  imports: [AsyncPipe, ScreencapturesCardComponent],
  templateUrl: './screenshots-view.component.html',
  styleUrl: './screenshots-view.component.sass',
})
export class ScreenshotsViewComponent implements OnInit {
  readonly #auroraHttpService = inject(AuroraHttpService);
  readonly uiService = inject(UiService);
  @Input({ required: true })
  gameConsoleConfiguration!: GameConsoleConfiguration;
  screenCaptureMetas: Signal<AuroraScreencaptureMeta[]>;

  constructor() {
    this.screenCaptureMetas = signal<AuroraScreencaptureMeta[]>([]);
  }

  ngOnInit() {
    this.screenCaptureMetas =
      this.#auroraHttpService.activeTitleScreencaptureMetasSorted(
        this.gameConsoleConfiguration,
      );
    // TODO load screencapture metas?
  }

  // called by parent component
  update(): Promise<AuroraScreencaptureMeta[] | null> {
    return this.#auroraHttpService.loadActiveTitleScreencaptureMetas(
      this.gameConsoleConfiguration,
    );
  }
}
