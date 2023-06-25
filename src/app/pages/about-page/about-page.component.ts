import { Component, OnInit } from '@angular/core';
import { getTauriVersion } from '@tauri-apps/api/app';
import { getVersion } from '@tauri-apps/api/app';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.sass'],
})
export class AboutPageComponent implements OnInit {
  appVersion: string;
  tauriVersion: string;

  constructor() {
    this.appVersion = 'unknown';
    this.tauriVersion = 'unknown';
  }

  async ngOnInit(): Promise<void> {
    this.appVersion = await getVersion();
    this.tauriVersion = await getTauriVersion();
  }
}
