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

import { XboxunityService } from '@app/modules/xbox-unity/services/xboxunity.service';
import {
  CoverInfoItem,
  CoverInfoResult,
  TitleListItem,
} from '@app/modules/xbox-unity/types/xbox-unity';
import { CoverCardComponent } from '../cover-card/cover-card.component';

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
      this.#xboxunityService
        .titleIconImageBytesUrl(this.titleListItem)
        .then((imageUrl) => {
          this.iconUrl = imageUrl;
        })
        .catch((error) => {
          this.iconUrl = null;
          console.error(
            `Failed to get xbox unity icon url. Got the following error:`,
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
        this.coverInfoResult = null;
        console.error(
          'Failed to load cover info. Got the following error:',
          error,
        );
        this.#snackBar.open('Failed to load covers', 'Close');
      });
  }
}
