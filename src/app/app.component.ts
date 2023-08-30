import { Component } from '@angular/core';
import { SidenavRouteGroup } from './interfaces/sidenav-route-group';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'australis';
  sidenavRouteGroups: SidenavRouteGroup[] = [
    {
      routes: [
        { title: 'Game Library', path: '/games' },
        { title: 'File Browser', path: '/files' },
        { title: 'Console Information', path: '/console' },
      ],
    },
    {
      routes: [
        { title: 'Settings', path: '/settings' },
        { title: 'About', path: '/about' },
      ],
    },
  ];
}
