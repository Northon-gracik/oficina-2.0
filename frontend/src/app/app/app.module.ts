import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from '../core/core.module';
import { PagesModule } from '../pages/pages.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AppRoutingModule,
    CoreModule,
    PagesModule,
    SharedModule,
  ],
})
export class AppModule {}
