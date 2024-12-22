import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { NavLink } from './interfaces/navlink';

@Component({
  selector: 'app-root',
  imports: [
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    AsyncPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent {
  private _breakpointObserver = inject(BreakpointObserver);
  title = 'australis';
  sidenavLinks: NavLink[];

  constructor() {
    this.sidenavLinks = [
      { href: '/consoles', label: 'Consoles', isActivated: false },
      { href: '/games', label: 'Games', isActivated: false },
      { href: '/settings', label: 'Settings', isActivated: false },
      { href: '/about', label: 'About', isActivated: false },
    ];
  }

  isHandset$: Observable<boolean> = this._breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay(),
    );
}
