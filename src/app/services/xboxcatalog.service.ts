import { Injectable, inject } from '@angular/core';

import { LiveImage } from '@app/types/xbox-catalog';
import { TauriService } from '@app/services/tauri.service';

@Injectable({
  providedIn: 'root',
})
export class XboxcatalogService {
  readonly #tauriService = inject(TauriService);

  constructor() {}

  liveImagesForTitleId(titleId: string, locale: string): Promise<LiveImage[]> {
    return this.#tauriService.xboxCatalogLiveImages(titleId, locale);
  }

  liveImageBytesUrl(liveImage: LiveImage): Promise<string | null> {
    return this.#tauriService.xboxCatalogLiveImageBytesUrl(liveImage);
  }
}
