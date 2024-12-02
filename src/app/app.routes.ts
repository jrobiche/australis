import { Routes } from '@angular/router';

import { AboutPageComponent } from './components/about-page/about-page.component';
import { ConsolesPageComponent } from './components/consoles-page/consoles-page.component';
import { GamesPageComponent } from './components/games-page/games-page.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { SettingsPageComponent } from './components/settings-page/settings-page.component';

export const routes: Routes = [
  { path: 'consoles', component: ConsolesPageComponent },
  { path: 'games', component: GamesPageComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: 'about', component: AboutPageComponent },
  { path: '', redirectTo: '/consoles', pathMatch: 'full' },
  { path: '**', component: NotFoundPageComponent },
];
