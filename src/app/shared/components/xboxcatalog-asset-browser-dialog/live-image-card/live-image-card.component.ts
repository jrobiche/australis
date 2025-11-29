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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { LiveImage } from '@app/modules/xbox-catalog/types/xbox-catalog';
import { XboxcatalogService } from '@app/modules/xbox-catalog/services/xboxcatalog.service';

@Component({
  selector: 'app-live-image-card',
  imports: [MatButtonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './live-image-card.component.html',
  styleUrl: './live-image-card.component.sass',
})
export class LiveImageCardComponent implements OnInit {
  readonly #snackBar = inject(MatSnackBar);
  readonly #xboxcatalogService = inject(XboxcatalogService);
  @Input({ required: true })
  liveImage!: LiveImage;
  @Output()
  imageSelected = new EventEmitter();
  hasError: boolean;
  imageUrl: string | null;
  isLoadingImage: boolean;

  constructor() {
    this.hasError = false;
    this.imageUrl = null;
    this.isLoadingImage = false;
  }

  ngOnInit() {
    this.isLoadingImage = true;
    this.#xboxcatalogService
      .liveImageBytesUrl(this.liveImage)
      .then((url) => {
        this.imageUrl = url;
      })
      .catch((error) => {
        this.hasError = true;
        this.imageUrl = null;
        console.error(
          'Failed to load image bytes url. Got the following error:',
          error,
        );
        this.#snackBar.open('Failed to load image.', '', {
          duration: 3000,
        });
      })
      .finally(() => {
        this.isLoadingImage = false;
      });
  }

  isSelectImageDisabled(): boolean {
    return this.isLoadingImage || this.hasError;
  }

  onSelectImageClick() {
    this.imageSelected.emit(this.liveImage);
  }
}
