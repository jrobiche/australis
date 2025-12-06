import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NOT_FOUND_ROUTES } from './not-found.routes';

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(NOT_FOUND_ROUTES)],
})
export class NotFoundModule {}
