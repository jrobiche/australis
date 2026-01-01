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

import { AuroraStateService } from '@app/modules/aurora/services/aurora-state.service';
import { AuroraProfile } from '@app/modules/aurora/types/aurora';
import { PageTitleToolbarComponent } from '@app/shared/components/page-title-toolbar/page-title-toolbar.component';
import { ResponsiveWidthContainerComponent } from '@app/shared/components/responsive-width-container/responsive-width-container.component';
import { BreakpointService } from '@app/shared/services/breakpoint.service';
import { GameConsoleConfiguration } from '@app/shared/types/app';
import { ProfileCardComponent } from '../profile-card/profile-card.component';

@Component({
  selector: 'app-profiles-view',
  imports: [
    AsyncPipe,
    MatSlideToggleModule,
    PageTitleToolbarComponent,
    ProfileCardComponent,
    ResponsiveWidthContainerComponent,
  ],
  templateUrl: './profiles-view.component.html',
  styleUrl: './profiles-view.component.sass',
})
export class ProfilesViewComponent implements OnInit {
  readonly #auroraState = inject(AuroraStateService);
  readonly breakpoint = inject(BreakpointService);
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
    this.imageUrls = this.#auroraState.profileImageUrls(
      this.gameConsoleConfiguration,
    );
    this.profiles = this.#auroraState.profiles(this.gameConsoleConfiguration);
  }

  onDisplayXuidsChange(event: MatSlideToggleChange): void {
    this.displayXuids = event.checked;
  }

  // called by parent component
  update(): Promise<void> {
    return this.#auroraState
      .loadProfiles(this.gameConsoleConfiguration)
      .then((_) => {
        let profiles = this.profiles();
        for (let i = 0; i < profiles.length; i++) {
          this.#auroraState
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
