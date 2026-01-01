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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ROUTER_OUTLET_DATA } from '@angular/router';

import { TelnetService } from '@app/modules/telnet/services/telnet.service';
import { TelnetResponse } from '@app/modules/telnet/types/telnet';
import { PageTitleToolbarComponent } from '@app/shared/components/page-title-toolbar/page-title-toolbar.component';
import { GameConsoleConfiguration } from '@app/shared/types/app';

@Component({
  selector: 'app-telnet-execute-command',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    PageTitleToolbarComponent,
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
  telnetResponse: TelnetResponse | null;
  errorText: string;

  constructor() {
    this.commandForm = this.#formBuilder.group({
      cmd: [null, [Validators.required]],
    });
    this.telnetResponse = null;
    this.errorText = '';
  }

  get telnetResponseDataString(): string {
    if (this.telnetResponse) {
      return String.fromCharCode(...this.telnetResponse.data);
    }
    return '';
  }

  // onGoClick(): void {
  //   this.#telnet
  //     .go(this.gameConsoleConfiguration())
  //     .then((resp) => {
  //       this.errorText = '';
  //       this.telnetResponse = resp;
  //     })
  //     .catch((error) => {
  //       this.errorText = `${error}`;
  //       this.telnetResponse = null;
  //     });
  // }

  // onStopClick(): void {
  //   this.#telnet
  //     .stop(this.gameConsoleConfiguration())
  //     .then((resp) => {
  //       this.errorText = '';
  //       this.telnetResponse = resp;
  //     })
  //     .catch((error) => {
  //       this.errorText = `${error}`;
  //       this.telnetResponse = null;
  //     });
  // }

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
