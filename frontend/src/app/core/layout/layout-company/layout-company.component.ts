import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout-company',
  templateUrl: './layout-company.component.html',
  styleUrl: './layout-company.component.scss',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class LayoutCopanyComponent {

}
