import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { AuroraAchievement } from '@app/types/aurora';

@Component({
  selector: 'app-achievement-card',
  imports: [MatCardModule],
  templateUrl: './achievement-card.component.html',
  styleUrl: './achievement-card.component.sass',
})
export class AchievementCardComponent {
  @Input({ required: true })
  achievement!: AuroraAchievement;
  @Input()
  displayHidden: boolean;
  @Input()
  iconImageUrl: string;

  constructor() {
    this.displayHidden = false;
    this.iconImageUrl = '';
  }

  get descriptionText(): string {
    if (this.isDisplayed) {
      return this.achievement.strings.description ?? 'Unknown';
    } else {
      return 'Hidden description';
    }
  }

  get gamerscoreText(): string {
    if (this.isDisplayed) {
      return this.achievement.cred.toString() ?? 'Unknown';
    } else {
      return 'Hidden';
    }
  }

  get isDisplayed(): boolean {
    return this.displayHidden || this.achievement.hidden == 0;
  }

  get titleText(): string {
    if (this.isDisplayed) {
      return this.achievement.strings.caption ?? 'Unknown';
    } else {
      return 'Secret Achievement';
    }
  }

  get typeText(): string {
    if (this.isDisplayed) {
      switch (this.achievement.type) {
        case 1:
          return 'Completion';
        case 2:
          return 'Leveling';
        case 3:
          return 'Unlock';
        case 4:
          return 'Event';
        case 5:
          return 'Tournament';
        case 6:
          return 'Checkpoint';
        case 7:
          return 'Other';
        default:
          return 'Unknown';
      }
    } else {
      return 'Hidden';
    }
  }
}
