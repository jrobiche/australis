import { Routes } from '@angular/router';

import { AboutPageComponent } from '@app/components/pages/about-page/about-page.component';
import { ConsolePageComponent } from '@app/components/pages/console-page/console-page.component';
import { ConsolesPageComponent } from '@app/components/pages/consoles-page/consoles-page.component';
import { EditAssetsPageComponent } from '@app/components/pages/edit-assets-page/edit-assets-page.component';
import { NotFoundPageComponent } from '@app/components/pages/not-found-page/not-found-page.component';

export const routes: Routes = [
  { path: 'about', component: AboutPageComponent },
  { path: 'consoles', component: ConsolesPageComponent },
  // TODO support gameId and systemDetailView via query params
  { path: 'consoles/:consoleId', component: ConsolePageComponent },
  {
    path: 'consoles/:consoleId/edit-assets/:gameId',
    component: EditAssetsPageComponent,
  },
  { path: '', redirectTo: '/consoles', pathMatch: 'full' },
  { path: '**', component: NotFoundPageComponent },
];
