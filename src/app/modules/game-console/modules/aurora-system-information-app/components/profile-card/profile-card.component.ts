import { Component, Input } from '@angular/core';

import { MatCardModule } from '@angular/material/card';

import { AuroraProfile } from '@app/modules/aurora/types/aurora';

@Component({
  selector: 'app-profile-card',
  imports: [MatCardModule],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.sass',
})
export class ProfileCardComponent {
  @Input()
  displayXuid: boolean;
  @Input()
  profile: AuroraProfile | null;
  @Input()
  profileImageUrl: string | null;

  constructor() {
    this.displayXuid = false;
    this.profile = null;
    this.profileImageUrl = null;
  }

  get gamerscoreText(): string {
    let value = 'Unknown';
    if (this.profile) {
      if (this.profile.signedin == 1) {
        value = this.profile.gamerscore.toString();
      } else {
        value = 'Unavailable';
      }
    }
    return value;
  }

  get gamertagText(): string {
    let value = 'Unknown';
    if (this.profile) {
      if (this.profile.signedin == 1) {
        value = this.profile.gamertag;
      } else {
        value = 'Not Signed In';
      }
    }
    return value;
  }

  get xuidText(): string {
    let value = 'Unknown';
    if (this.profile) {
      if (this.profile.signedin == 1) {
        value = this.profile.xuid;
      } else {
        value = 'Unavailable';
      }
    }
    return value;
  }
}
