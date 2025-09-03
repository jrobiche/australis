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

import { CoverCardComponent } from '../cover-card/cover-card.component';
import {
  CoverInfoItem,
  CoverInfoResult,
  TitleListItem,
} from '@app/types/xbox-unity';
import { XboxunityService } from '@app/services/xboxunity.service';

@Component({
  selector: 'app-title-card',
  imports: [MatButtonModule, MatCardModule, CoverCardComponent],
  templateUrl: './title-card.component.html',
  styleUrl: './title-card.component.sass',
})
export class TitleCardComponent implements OnInit {
  readonly #snackBar = inject(MatSnackBar);
  readonly #xboxunityService = inject(XboxunityService);
  // TODO do not allow null
  @Input({ required: true })
  titleListItem: TitleListItem | null;
  @Output()
  coverSelected = new EventEmitter<CoverInfoItem>();
  coverInfoResult: CoverInfoResult | null;
  iconUrl: string | null;

  constructor() {
    this.titleListItem = null;
    this.coverInfoResult = null;
    this.iconUrl = null;
  }

  ngOnInit() {
    if (this.titleListItem) {
      let titleId = this.titleListItem.TitleID;
      this.#xboxunityService
        .iconImageUrl(titleId)
        .then((imageUrl) => {
          this.iconUrl = imageUrl;
        })
        .catch((error) => {
          console.error(
            `Failed to get xbox unity icon url for title id '${titleId}'. Got the following error:`,
            error,
          );
        });
    }
  }

  get coverCountText(): string {
    if (this.titleListItem) {
      return this.titleListItem.Covers;
    }
    return 'Unknown';
  }

  get titleText(): string {
    if (this.titleListItem) {
      return this.titleListItem.Name;
    }
    return 'Unknown';
  }

  onCoverSelected(cover: CoverInfoItem): void {
    return this.coverSelected.emit(cover);
  }

  onViewCoversClick(): void {
    if (this.titleListItem == null) {
      return;
    }
    this.#xboxunityService
      .coverInfo(this.titleListItem.TitleID)
      .then((result) => {
        this.coverInfoResult = result;
      })
      .catch((error) => {
        console.error(
          'Failed to load cover info. Got the following error:',
          error,
        );
        this.#snackBar.open('Failed to load covers', 'Close');
      });
  }
}
