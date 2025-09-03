import { Component, Input, inject } from '@angular/core';
import { Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-page-toolbar',
  imports: [MatButtonModule, MatIconModule, MatToolbarModule],
  templateUrl: './page-toolbar.component.html',
  styleUrl: './page-toolbar.component.sass',
})
export class PageToolbarComponent {
  readonly #location = inject(Location);
  @Input({ required: true })
  heading!: string;
  @Input()
  backButton: boolean;

  constructor() {
    this.backButton = true;
  }

  onBackClick(): void {
    this.#location.back();
  }
}
