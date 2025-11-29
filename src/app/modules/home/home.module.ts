import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HOME_ROUTES } from './home.routes';

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(HOME_ROUTES)],
})
export class HomeModule {}
