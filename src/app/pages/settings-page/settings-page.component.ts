import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectionListChange } from '@angular/material/list';
import { Subscription } from 'rxjs';
import { UiService } from '../../services/ui.service';
import { ConfirmationDialog } from '../../interfaces/confirmation-dialog';
import { GameConsoleConfiguration } from '../../interfaces/game-console-configuration';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';
import { GameConsoleConfigurationDialogComponent } from '../../components/game-console-configuration-dialog/game-console-configuration-dialog.component';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.sass'],
})
export class SettingsPageComponent implements AfterViewInit, OnDestroy {
  gameConsoleConfigurations: GameConsoleConfiguration[];
  selectedGameConsoleConfiguration: GameConsoleConfiguration | null;
  subscriptions: Subscription[];

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private uiService: UiService
  ) {
    this.gameConsoleConfigurations =
      this.uiService.getGameConsoleConfigurations();
    this.selectedGameConsoleConfiguration =
      this.uiService.getSelectedGameConsoleConfiguration();
    this.subscriptions = [];
    this.subscriptions.push(
      this.uiService
        .onGameConsoleConfigurationsChange()
        .subscribe((value: GameConsoleConfiguration[]) => {
          value.sort(this.uiService.sortGameConsoleConfigurationsByName);
          this.gameConsoleConfigurations = value;
          this.changeDetectorRef.detectChanges();
        })
    );
    this.subscriptions.push(
      this.uiService
        .onSelectedGameConsoleConfigurationChange()
        .subscribe((value: GameConsoleConfiguration | null) => {
          this.selectedGameConsoleConfiguration = value;
          this.changeDetectorRef.detectChanges();
        })
    );
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  isSelectedGameConsoleConfiguration(
    gameConsoleConfiguration: GameConsoleConfiguration | null
  ) {
    if (gameConsoleConfiguration === null) {
      return this.selectedGameConsoleConfiguration === gameConsoleConfiguration;
    }
    return (
      this.selectedGameConsoleConfiguration !== null &&
      this.selectedGameConsoleConfiguration.id === gameConsoleConfiguration.id
    );
  }

  onAddConsoleClick(): void {
    this.dialog.open(GameConsoleConfigurationDialogComponent, {
      data: null,
    });
  }

  onDeleteConsoleClick(
    gameConsoleConfiguration: GameConsoleConfiguration
  ): void {
    let data: ConfirmationDialog = {
      title: 'Delete Console',
      body: `Are you sure you want to permanently delete the console named '${gameConsoleConfiguration.name}'?`,
    };
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: data,
    });
    let subscription = dialogRef
      .afterClosed()
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.uiService.deleteGameConsoleConfiguration(
            gameConsoleConfiguration.id
          );
        }
      });
    this.subscriptions.push(subscription);
  }

  onEditConsoleClick(gameConsoleConfiguration: GameConsoleConfiguration): void {
    this.dialog.open(GameConsoleConfigurationDialogComponent, {
      data: gameConsoleConfiguration,
    });
  }

  onGameConsoleListSelectionChange(change: MatSelectionListChange): void {
    this.uiService.setSelectedGameConsoleConfiguration(change.options[0].value);
  }
}
