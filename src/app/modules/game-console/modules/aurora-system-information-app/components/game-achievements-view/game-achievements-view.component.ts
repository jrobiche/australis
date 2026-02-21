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
import { AuroraAchievement } from '@app/modules/aurora/types/aurora';
import { PageTitleToolbarComponent } from '@app/shared/components/page-title-toolbar/page-title-toolbar.component';
import { ResponsiveWidthContainerComponent } from '@app/shared/components/responsive-width-container/responsive-width-container.component';
import { BreakpointService } from '@app/shared/services/breakpoint.service';
import { GameConsoleConfiguration } from '@app/shared/types/app';
import { AchievementCardComponent } from '../achievement-card/achievement-card.component';

@Component({
  selector: 'app-game-achievements-view',
  imports: [
    AsyncPipe,
    AchievementCardComponent,
    MatSlideToggleModule,
    PageTitleToolbarComponent,
    ResponsiveWidthContainerComponent,
  ],
  templateUrl: './game-achievements-view.component.html',
  styleUrl: './game-achievements-view.component.sass',
})
export class GameAchievementsViewComponent implements OnInit {
  readonly #auroraState = inject(AuroraStateService);
  readonly breakpoint = inject(BreakpointService);
  @Input({ required: true })
  gameConsoleConfiguration!: GameConsoleConfiguration;
  achievements: Signal<AuroraAchievement[]>;
  displayHiddenAchievements: boolean;
  imageUrls: string[];

  constructor() {
    this.achievements = signal<AuroraAchievement[]>([]);
    this.displayHiddenAchievements = false;
    this.imageUrls = [];
  }

  ngOnInit() {
    this.achievements = this.#auroraState.activeTitleAchievements(
      this.gameConsoleConfiguration,
    );
    this.#updateImageUrls(this.achievements());
  }

  imageUrl(index: number): string {
    return this.imageUrls[index] ?? '';
  }

  onDisplayHiddenAchievementsChange(event: MatSlideToggleChange): void {
    this.displayHiddenAchievements = event.checked;
  }

  // called by parent component
  update(): Promise<AuroraAchievement[] | null> {
    let achievementsStr = JSON.stringify(this.achievements());
    return this.#auroraState
      .loadActiveTitleAchievements(this.gameConsoleConfiguration)
      .then((updatedAchievements) => {
        let updatedAchievementsStr = JSON.stringify(updatedAchievements);
        if (updatedAchievementsStr !== achievementsStr) {
          this.#updateImageUrls(updatedAchievements);
        }
        return Promise.resolve(updatedAchievements);
      })
      .catch((error) => {
        console.error(
          'Failed to load active title achievements. Got the following error:',
          error,
        );
        return Promise.resolve(null);
      });
  }

  async #updateImageUrls(achievements: AuroraAchievement[]): Promise<void> {
    this.imageUrls = [];
    for (let i = 0; i < achievements.length; i++) {
      try {
        this.imageUrls[i] =
          await this.#auroraState.activeTitleAchievementImageUrl(
            this.gameConsoleConfiguration,
            achievements[i].imageid,
          );
      } catch (error) {
        console.error(
          'Failed to load achievement image url. Got the following error:',
          error,
        );
        this.imageUrls[i] = '';
      }
    }
  }
}
