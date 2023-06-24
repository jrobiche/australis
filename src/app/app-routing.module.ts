import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutPageComponent } from './pages/about-page/about-page.component';
import { ConsolePageComponent } from './pages/console-page/console-page.component';
import { FilesPageComponent } from './pages/files-page/files-page.component';
import { GamesPageComponent } from './pages/games-page/games-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';

const routes: Routes = [
  { path: 'about', component: AboutPageComponent },
  { path: 'console', component: ConsolePageComponent },
  { path: 'files', component: FilesPageComponent },
  { path: 'games', component: GamesPageComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: '', redirectTo: '/games', pathMatch: 'full' },
  { path: '**', component: NotFoundPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
