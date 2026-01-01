import { AsyncPipe } from '@angular/common';
import { Component, OnInit, Signal, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ROUTER_OUTLET_DATA } from '@angular/router';

import { BreakpointService } from '@app/shared/services/breakpoint.service';
import { PageTitleToolbarComponent } from '@app/shared/components/page-title-toolbar/page-title-toolbar.component';
import { ResponsiveWidthContainerComponent } from '@app/shared/components/responsive-width-container/responsive-width-container.component';
import { GameConsoleConfiguration } from '@app/shared/types/app';
import { TelnetExecuteCommandComponent } from './components/telnet-execute-command/telnet-execute-command.component';
import { TelnetFileBrowserComponent } from './components/telnet-file-browser/telnet-file-browser.component';
import { TelnetMemoryEditorComponent } from './components/telnet-memory-editor/telnet-memory-editor.component';

@Component({
  selector: 'app-telnet-client-app',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    PageTitleToolbarComponent,
    ResponsiveWidthContainerComponent,
    TelnetExecuteCommandComponent,
    TelnetFileBrowserComponent,
    TelnetMemoryEditorComponent,
  ],
  templateUrl: './telnet-client-app.component.html',
  styleUrl: './telnet-client-app.component.sass',
})
export class TelnetClientAppComponent implements OnInit {
  readonly breakpoint = inject(BreakpointService);
  readonly gameConsoleConfiguration = inject(
    ROUTER_OUTLET_DATA,
  ) as Signal<GameConsoleConfiguration>;
  @ViewChild('drawer')
  drawer: MatDrawer | null;
  selectedView: string;
  viewListItems: { title: string; value: string }[];

  constructor() {
    this.drawer = null;
    // TODO sort differently
    this.viewListItems = [
      {
        title: 'Run Command',
        value: 'execute-command',
      },
      {
        title: 'File Browser',
        value: 'file-browser',
      },
      {
        title: 'Memory Editor',
        value: 'memory-editor',
      },
    ];
    this.selectedView = this.viewListItems[0].value;
  }

  ngOnInit() {
    if (this.breakpoint.isWeb) {
      setTimeout(() => {
        this.drawer?.open();
      }, 250);
    }
  }

  onDetailsViewSelectionChange($event: any) {
    this.selectedView = $event.options[0].value;
    if (this.drawer && !this.breakpoint.isWeb) {
      this.drawer.close();
    }
  }
}
