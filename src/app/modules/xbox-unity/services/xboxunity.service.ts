import { Injectable, inject } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';

import {
  CoverInfoResult,
  TitleListItem,
  TitleListResult,
} from '../types/xbox-unity';

@Injectable({
  providedIn: 'root',
})
export class XboxunityService {
  constructor() {}

  // TODO rename to `...DataUrl`
  coverImageBytesUrl(
    coverId: string,
    coverSize: 'small' | 'large',
  ): Promise<string> {
    return invoke('xboxunity_cover_image_bytes_url', {
      coverId: coverId,
      coverSize: coverSize,
    });
  }

  // coverImageUrl(
  //   coverId: string,
  //   coverSize: 'small' | 'large',
  // ): Promise<string> {
  //   return this.#tauriService.xboxUnityCoverImageUrl(coverId, coverSize);
  // }

  coverInfo(titleId: string): Promise<CoverInfoResult> {
    return invoke('xboxunity_cover_info', {
      titleId: titleId,
    });
  }

  // iconImageUrl(titleId: string): Promise<string> {
  //   return this.#tauriService.xboxUnityIconImageUrl(titleId);
  // }

  // titleIconImageUrl(titleListItem: TitleListItem): Promise<string> {
  //   return this.#tauriService.xboxunityTitleIconImageUrl(titleListItem);
  // }

  titleIconImageBytesUrl(titleListItem: TitleListItem): Promise<string> {
    return invoke('xboxunity_title_icon_image_bytes_url', {
      titleListItem: titleListItem,
    });
  }

  titleList(
    query: string,
    page: number,
    count: number,
  ): Promise<TitleListResult> {
    return invoke('xboxunity_title_list', {
      query: query,
      page: page,
      count: count,
    });
  }
}
