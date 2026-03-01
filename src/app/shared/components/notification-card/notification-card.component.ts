import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-notification-card',
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatTooltipModule],
  templateUrl: './notification-card.component.html',
  styleUrl: './notification-card.component.sass',
})
export class NotificationCardComponent {
  #elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  @Input()
  dismissable: boolean;
  @Input()
  message: string;
  @Output()
  dismissed = new EventEmitter();

  constructor() {
    this.dismissable = true;
    this.message = '';
  }

  get cardClass(): string {
    if (this.isErrorCard) {
      return 'error-card';
    }
    if (this.isWarningCard) {
      return 'warning-card';
    }
    return 'information-card';
  }

  get iconName(): string {
    if (this.isErrorCard) {
      return 'error';
    }
    if (this.isWarningCard) {
      return 'warning';
    }
    return 'info';
  }

  get iconFontSet(): string {
    if (this.isInformationCard) {
      return 'material-icons-outlined';
    }
    return 'material-icons-round';
  }

  get isErrorCard(): boolean {
    return this.#elementRef.nativeElement.hasAttribute('error-card');
  }

  get isInformationCard(): boolean {
    return !this.isErrorCard && !this.isWarningCard;
  }

  get isWarningCard(): boolean {
    return this.#elementRef.nativeElement.hasAttribute('warning-card');
  }

  get titleText(): string {
    if (this.isErrorCard) {
      return 'Error';
    }
    if (this.isWarningCard) {
      return 'Warning';
    }
    return 'Information';
  }
}
