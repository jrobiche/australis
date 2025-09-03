import { Injectable, inject } from '@angular/core';

import {
  CoverInfoItem,
  CoverInfoResult,
  TitleListItem,
  TitleListResult,
} from '@app/types/xbox-unity';
import { TauriService } from '@app/services/tauri.service';

@Injectable({
  providedIn: 'root',
})
export class XboxunityService {
  readonly #tauriService = inject(TauriService);

  constructor() {}

  coverImageBytesUrl(
    coverId: string,
    coverSize: 'small' | 'large',
  ): Promise<string | null> {
    return this.#tauriService.xboxUnityCoverImageBytesUrl(coverId, coverSize);
  }

  coverImageUrl(
    coverId: string,
    coverSize: 'small' | 'large',
  ): Promise<string> {
    return this.#tauriService.xboxUnityCoverImageUrl(coverId, coverSize);
  }

  coverInfo(titleId: string): Promise<CoverInfoResult> {
    return this.#tauriService.xboxUnityCoverInfo(titleId);
  }

  iconImageUrl(titleId: string): Promise<string> {
    return this.#tauriService.xboxUnityIconImageUrl(titleId);
  }

  titleList(
    query: string,
    page: number,
    count: number,
  ): Promise<TitleListResult> {
    return this.#tauriService.xboxUnityTitleList(query, page, count);
  }
}
