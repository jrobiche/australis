import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';

import { AboutPageComponent } from './pages/about-page/about-page.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { ConsolePageComponent } from './pages/console-page/console-page.component';
import { FilesPageComponent } from './pages/files-page/files-page.component';
import { GameConsoleConfigurationDialogComponent } from './components/game-console-configuration-dialog/game-console-configuration-dialog.component';
import { GamesPageComponent } from './pages/games-page/games-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutPageComponent,
    ConfirmationDialogComponent,
    ConsolePageComponent,
    FilesPageComponent,
    GameConsoleConfigurationDialogComponent,
    GamesPageComponent,
    NotFoundPageComponent,
    SettingsPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatRippleModule,
    MatSidenavModule,
    MatToolbarModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
