import { Injectable, TemplateRef } from '@angular/core';

export interface Toast {
	// template: TemplateRef<any>;
  message: string;
	classname?: string;
	delay?: number;
}

@Injectable({ providedIn: 'root' })
export class ToasterService {

	toasts: Toast[] = [];

  showStandard(message: string) {
		this.show({ message, });
	}

	showSuccess(message: string) {
		this.show({ message, classname: 'bg-success text-light', delay: 10000 });
	}

	showDanger(message: string) {
		this.show({ message, classname: 'bg-danger text-light', delay: 15000 });
	}

	show(toast: Toast) {
		this.toasts.push(toast);
	}

	remove(toast: Toast) {
		this.toasts = this.toasts.filter((t) => t !== toast);
	}

	clear() {
		this.toasts.splice(0, this.toasts.length);
	}
}
