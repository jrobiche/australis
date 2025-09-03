import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  Signal,
  inject,
  signal,
} from '@angular/core';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';

import { AuroraHttpService } from '@app/services/aurora-http.service';
import { AuroraProfile } from '@app/types/aurora';
import { ProfileCardComponent } from '@app/components/cards/profile-card/profile-card.component';
import { GameConsoleConfiguration } from '@app/types/app';
import { UiService } from '@app/services/ui.service';

@Component({
  selector: 'app-profiles-view',
  imports: [AsyncPipe, MatSlideToggleModule, ProfileCardComponent],
  templateUrl: './profiles-view.component.html',
  styleUrl: './profiles-view.component.sass',
})
export class ProfilesViewComponent implements OnInit {
  readonly #auroraHttpService = inject(AuroraHttpService);
  readonly uiService = inject(UiService);
  @Input({ required: true })
  gameConsoleConfiguration!: GameConsoleConfiguration;
  displayXuids: boolean;
  imageUrls: Signal<[string, string, string, string]>;
  profiles: Signal<(AuroraProfile | null)[]>;

  constructor() {
    this.displayXuids = false;
    this.imageUrls = signal<[string, string, string, string]>(['', '', '', '']);
    this.profiles = signal<(AuroraProfile | null)[]>([]);
  }

  ngOnInit() {
    this.imageUrls = this.#auroraHttpService.profileImageUrls(
      this.gameConsoleConfiguration,
    );
    this.profiles = this.#auroraHttpService.profiles(
      this.gameConsoleConfiguration,
    );
    // TODO load profiles and profile image urls?
  }

  onDisplayXuidsChange(event: MatSlideToggleChange): void {
    this.displayXuids = event.checked;
  }

  // called by parent component
  update(): Promise<void> {
    return this.#auroraHttpService
      .loadProfiles(this.gameConsoleConfiguration)
      .then((_) => {
        let profiles = this.profiles();
        for (let i = 0; i < profiles.length; i++) {
          if (profiles[i]?.signedin != 1) {
            continue;
          }
          this.#auroraHttpService
            .loadProfileImageUrl(this.gameConsoleConfiguration, i)
            .catch((error) => {
              console.error(
                'Failed to load profile image url. Got the following error:',
                error,
              );
            });
        }
      })
      .catch((error) => {
        console.error(
          'Failed to load profiles. Got the following error:',
          error,
        );
        return Promise.resolve();
      });
  }
}
