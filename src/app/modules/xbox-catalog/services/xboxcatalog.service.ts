import { Injectable, inject } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';

import { LiveImage } from '../types/xbox-catalog';

@Injectable({
  providedIn: 'root',
})
export class XboxcatalogService {
  constructor() {}

  liveImagesForTitleId(
    titleId: number,
    localeCode: string,
  ): Promise<LiveImage[]> {
    return invoke('xboxcatalog_live_images', {
      titleId: titleId,
      localeCode: localeCode,
    });
  }

  liveImageDataUrl(liveImage: LiveImage): Promise<string | null> {
    return invoke('xboxcatalog_live_image_bytes_url', {
      liveImage: liveImage,
    });
  }
}
