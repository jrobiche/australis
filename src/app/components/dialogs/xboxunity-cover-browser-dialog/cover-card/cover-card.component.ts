import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CoverInfoItem } from '@app/types/xbox-unity';
import { XboxunityService } from '@app/services/xboxunity.service';

@Component({
  selector: 'app-cover-card',
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './cover-card.component.html',
  styleUrl: './cover-card.component.sass',
})
export class CoverCardComponent implements OnInit {
  readonly #snackBar = inject(MatSnackBar);
  readonly #xboxunityService = inject(XboxunityService);
  @Input({ required: true })
  coverInfoItem: CoverInfoItem | null;
  @Output()
  selected = new EventEmitter();
  imageUrl: string | null;

  constructor() {
    this.coverInfoItem = null;
    this.imageUrl = null;
  }

  ngOnInit(): void {
    if (this.coverInfoItem) {
      this.#xboxunityService
        .coverImageUrl(this.coverInfoItem.CoverID, 'small')
        .then((url: string) => {
          this.imageUrl = url;
        })
        .catch((error) => {
          console.error(
            'Failed to load cover image url. Got the following error:',
            error,
          );
          this.#snackBar.open('Failed to load cover', '', {
            duration: 3000,
          });
        });
    }
  }

  get titleText(): string {
    let username = 'Unknown';
    if (this.coverInfoItem) {
      username = this.coverInfoItem.Username;
    }
    return `Cover by ${username}`;
  }

  onSelectCoverClick() {
    this.selected.emit();
  }

  onViewLargeCoverClick() {
    if (this.coverInfoItem) {
      this.#xboxunityService
        .coverImageUrl(this.coverInfoItem.CoverID, 'large')
        .then((url: string) => {
          this.imageUrl = url;
        })
        .catch((error) => {
          console.error(
            'Failed to load cover image url. Got the following error:',
            error,
          );
          this.#snackBar.open('Failed to load cover', '', {
            duration: 3000,
          });
        });
    }
  }
}
