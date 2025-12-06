import { Injectable } from '@angular/core';

enum FontSize {
  Small,
  Medium,
  Large,
}

@Injectable({
  providedIn: 'root',
})
export class AppSettingsService {
  #fontSize: FontSize;

  constructor() {
    // TODO allow this to be configured through the ui
    // this.#fontSize = FontSize.Small;
    this.#fontSize = FontSize.Medium;
    // this.#fontSize = FontSize.Large;
  }

  get isFontSizeSmall(): boolean {
    return this.#fontSize == FontSize.Small;
  }

  get isFontSizeMedium(): boolean {
    return this.#fontSize == FontSize.Medium;
  }

  get isFontSizeLarge(): boolean {
    return this.#fontSize == FontSize.Large;
  }
}
