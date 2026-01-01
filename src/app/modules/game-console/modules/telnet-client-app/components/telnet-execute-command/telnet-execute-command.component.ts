import { Component, Input, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ROUTER_OUTLET_DATA } from '@angular/router';

import { TelnetService } from '@app/modules/telnet/services/telnet.service';
import { TelnetResponse } from '@app/modules/telnet/types/telnet';
import { PageTitleToolbarComponent } from '@app/shared/components/page-title-toolbar/page-title-toolbar.component';
import { ResponsiveWidthContainerComponent } from '@app/shared/components/responsive-width-container/responsive-width-container.component';
import { GameConsoleConfiguration } from '@app/shared/types/app';

@Component({
  selector: 'app-telnet-execute-command',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    PageTitleToolbarComponent,
    ResponsiveWidthContainerComponent,
  ],
  templateUrl: './telnet-execute-command.component.html',
  styleUrl: './telnet-execute-command.component.sass',
})
export class TelnetExecuteCommandComponent {
  readonly #formBuilder = inject(FormBuilder);
  readonly #telnet = inject(TelnetService);
  @Input({ required: true })
  gameConsoleConfiguration!: GameConsoleConfiguration;
  commandForm: FormGroup;
  errorText: string;
  telnetResponse: TelnetResponse | null;

  constructor() {
    this.commandForm = this.#formBuilder.group({
      cmd: [null, [Validators.required]],
    });
    this.errorText = '';
    this.telnetResponse = null;
  }

  get telnetResponseDataString(): string {
    if (this.telnetResponse) {
      return String.fromCharCode(...this.telnetResponse.data);
    }
    return '';
  }

  onSubmitClick(): void {
    if (this.commandForm.valid) {
      this.errorText = '';
      this.telnetResponse = null;
      this.#telnet
        .exec(this.gameConsoleConfiguration, this.commandForm.value.cmd)
        .then((resp) => {
          this.telnetResponse = resp;
        })
        .catch((error) => {
          this.errorText = `${error}`;
        });
    }
  }
}
