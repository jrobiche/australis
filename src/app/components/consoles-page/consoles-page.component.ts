import { Component, OnInit, Signal, inject } from '@angular/core';

import { ConsoleDashboardComponent } from '../console-dashboard/console-dashboard.component';
import { ConsoleManagerComponent } from '../console-manager/console-manager.component';
import { GameConsole } from '../../classes/game-console';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-consoles-page',
  imports: [ConsoleDashboardComponent, ConsoleManagerComponent],
  templateUrl: './consoles-page.component.html',
  styleUrl: './consoles-page.component.sass',
})
export class ConsolesPageComponent implements OnInit {
  private readonly _uiService = inject(UiService);
  selectedConsole: Signal<GameConsole | null>;

  constructor() {
    this.selectedConsole = this._uiService.selectedConsole;
  }

  ngOnInit() {
    this._uiService.loadConsoleConfigurations(false);
  }
}
