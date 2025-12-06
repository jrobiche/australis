import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ABOUT_ROUTES } from './about.routes';

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(ABOUT_ROUTES)],
})
export class AboutModule {}
