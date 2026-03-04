import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  appCacheSize(): Promise<number> {
    return invoke('app_cache_size');
  }

  appDataSize(): Promise<number> {
    return invoke('app_data_size');
  }

  clearCache(): Promise<void> {
    return invoke('app_cache_clear');
  }
}
