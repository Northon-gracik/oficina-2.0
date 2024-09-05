import { ToasterService } from './toaster.service';
import { Component, inject } from '@angular/core';

import { NgTemplateOutlet } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-toasts',
	templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.scss',
	host: { class: 'toast-container position-fixed top-0 end-0 p-3 pt-5 px-5', style: 'z-index: 1200' },
})

export class ToasterComponent {
  toastService = inject(ToasterService)
}
