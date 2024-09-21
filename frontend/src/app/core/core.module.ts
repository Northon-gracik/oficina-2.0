import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutCopanyComponent } from './layout/layout-company/layout-company.component';
import { RouterModule, RouterOutlet } from '@angular/router';



@NgModule({
  declarations: [
    LayoutCopanyComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
  ]
})
export class CoreModule { }
