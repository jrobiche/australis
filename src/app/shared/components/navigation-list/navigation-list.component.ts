import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

import { NavigationLink } from '../../types/app';

@Component({
  selector: 'app-navigation-list',
  imports: [MatIconModule, MatListModule, RouterModule],
  templateUrl: './navigation-list.component.html',
  styleUrl: './navigation-list.component.sass',
})
export class NavigationListComponent {
  @Input()
  ariaLabel: string;
  @Input()
  chevron: boolean;
  @Input()
  links: NavigationLink[];

  constructor() {
    this.ariaLabel = 'Select location';
    this.chevron = true;
    this.links = [];
  }
}
