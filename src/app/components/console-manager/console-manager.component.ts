import { Component, Signal, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';

import { CreateUpdateConsoleDialogComponent } from '../create-update-console-dialog/create-update-console-dialog.component';
import { GameConsoleConfiguration } from '../../interfaces/game-console-configuration';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-console-manager',
  imports: [MatButtonModule, MatCardModule, MatListModule, MatToolbarModule],
  templateUrl: './console-manager.component.html',
  styleUrl: './console-manager.component.sass',
})
export class ConsoleManagerComponent {
  private readonly _dialog = inject(MatDialog);
  private readonly _uiService = inject(UiService);
  consoleConfigurations: Signal<GameConsoleConfiguration[]>;

  constructor() {
    this.consoleConfigurations = this._uiService.consoleConfigurations;
  }

  compareGameConsoleConfigurations(
    a: GameConsoleConfiguration,
    b: GameConsoleConfiguration,
  ) {
    // compare names
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names are the same, compare ids
    const idA = a.id.toUpperCase();
    const idB = b.id.toUpperCase();
    if (idA < idB) {
      return -1;
    }
    if (idA > idB) {
      return 1;
    }
    return 0;
  }

  onConsoleSelectionChange(event: any) {
    this._uiService.selectConsoleConfiguration(event.options[0].value);
  }

  openCreateConsoleConfigurationDialog() {
    this._dialog
      .open(CreateUpdateConsoleDialogComponent, {
        data: null,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result !== undefined) {
          let consoleConfig = result as GameConsoleConfiguration;
          this._uiService.createConsoleConfiguration(
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

  reloadConsoleConfigurations() {
    this._uiService.loadConsoleConfigurations(true);
  }

  sortedConsoleConfigurations(): GameConsoleConfiguration[] {
    return this.consoleConfigurations().sort(
      this.compareGameConsoleConfigurations,
    );
  }
}
