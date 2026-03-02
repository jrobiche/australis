import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { NavigationListComponent } from '@app/shared/components/navigation-list/navigation-list.component';
import { NotificationCardComponent } from '@app/shared/components/notification-card/notification-card.component';
import { PageTitleToolbarComponent } from '@app/shared/components/page-title-toolbar/page-title-toolbar.component';
import { PageToolbarComponent } from '@app/shared/components/page-toolbar/page-toolbar.component';
import { ResponsiveWidthContainerComponent } from '@app/shared/components/responsive-width-container/responsive-width-container.component';
import { BreakpointService } from '@app/shared/services/breakpoint.service';
import { DialogService } from '@app/shared/services/dialog.service';
import { GameConsoleConfigurationStoreService } from '@app/shared/services/game-console-configuration-store.service';
import {
  GameConsoleConfiguration,
  NavigationLink,
} from '@app/shared/types/app';

@Component({
  selector: 'app-home-page',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    NavigationListComponent,
    NotificationCardComponent,
    PageTitleToolbarComponent,
    PageToolbarComponent,
    ResponsiveWidthContainerComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.sass',
})
export class HomePageComponent {
  readonly #dialogService = inject(DialogService);
  readonly #gameConsoleConfigurationStore = inject(
    GameConsoleConfigurationStoreService,
  );
  readonly breakpoint = inject(BreakpointService);
  errorMessages: string[];
  links: NavigationLink[];

  constructor() {
    this.errorMessages = [];
    this.links = [];
  }

  ngOnInit() {
    this.#loadLinks();
  }

  onAddConsoleClick(): void {
    this.#dialogService
      .openCreateConsoleDialog()
      .subscribe((newConfiguration) => {
        if (newConfiguration) {
          this.#loadLinks();
        }
      });
  }

  onErrorDismissed(index: number): void {
    this.errorMessages.splice(index, 1);
  }

  #loadLinks(): void {
    this.#gameConsoleConfigurationStore
      .readAllSorted()
      .then((configs) => {
        this.links = configs.map((config) => {
          return {
            routerLink: ['/', 'consoles', config.id],
            title: config.name,
          };
        });
      })
      .catch((error) => {
        this.links = [];
        console.error(
          'Failed to load game console configurations. Got the following error:',
          error,
        );
        this.errorMessages.push('Failed to load game console configurations.');
      });
  }
}
