import { Component } from '@angular/core';
import { SidenavRoute } from './interfaces/sidenav-route';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'australis';
  sidenavRoutes: SidenavRoute[] = [
    { title: 'Game Library', path: '/games' },
    { title: 'File Browser', path: '/files' },
    { title: 'Console Information', path: '/console' },
    { title: 'Settings', path: '/settings' },
    { title: 'About', path: '/about' },
  ];
}
