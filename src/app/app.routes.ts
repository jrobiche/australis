import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'about',
    loadChildren: () =>
      import('@app/modules/about/about.module').then((mod) => mod.AboutModule),
  },
  {
    path: 'consoles',
    loadChildren: () =>
      import('@app/modules/game-console/game-console.module').then(
        (mod) => mod.GameConsoleModule,
      ),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('@app/modules/home/home.module').then((mod) => mod.HomeModule),
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: '**',
    loadChildren: () =>
      import('@app/modules/not-found/not-found.module').then(
        (mod) => mod.NotFoundModule,
      ),
  },
];
