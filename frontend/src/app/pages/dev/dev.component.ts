import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormControl } from '@angular/forms';
import { ToasterService } from '../../shared/components/toaster/toaster.service';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../shared/components/loader/loader.service';

@Component({
  selector: 'app-dev',
  templateUrl: './dev.component.html',
  styleUrl: './dev.component.scss',
  standalone: true,
  imports: [CommonModule, SharedModule, NgbTooltipModule],
})
export class DevComponent {
  public control = new FormControl('');

  toastService = inject(ToasterService);
  loader = inject(LoaderService);

  showStandard() {
    this.toastService.showStandard('Mensagem padrao');
  }

  showSuccess() {
    this.toastService.showSuccess('Mensagem de confirmacao');
  }

  showDanger() {
    this.toastService.showDanger('Mensagem de erro');
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }

  showLoader(): void {
    this.loader.show();
    setTimeout(() => this.loader.hide(), 5000);
  }
}
