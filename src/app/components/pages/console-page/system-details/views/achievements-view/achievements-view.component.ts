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

import { AchievementCardComponent } from '@app/components/cards/achievement-card/achievement-card.component';
import { AuroraAchievement } from '@app/types/aurora';
import { AuroraHttpService } from '@app/services/aurora-http.service';
import { GameConsoleConfiguration } from '@app/types/app';
import { UiService } from '@app/services/ui.service';

@Component({
  selector: 'app-achievements-view',
  imports: [AsyncPipe, AchievementCardComponent, MatSlideToggleModule],
  templateUrl: './achievements-view.component.html',
  styleUrl: './achievements-view.component.sass',
})
export class AchievementsViewComponent implements OnInit {
  readonly #auroraHttpService = inject(AuroraHttpService);
  readonly uiService = inject(UiService);
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
    this.achievements = this.#auroraHttpService.activeTitleAchievements(
      this.gameConsoleConfiguration,
    );
    this.#updateImageUrls(this.achievements());
    // TODO load achievements?
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
    return this.#auroraHttpService
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
          await this.#auroraHttpService.activeTitleAchievementImageUrl(
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
