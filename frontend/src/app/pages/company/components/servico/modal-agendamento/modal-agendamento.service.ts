import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAgendamentoComponent } from './modal-agendamento.component';

@Injectable({
  providedIn: 'root'
})
export class ModalAgendamentoService {
  constructor(private modal: NgbModal) { }

  public async openModal(): Promise<void> {
    const modalOpened = this.modal.open(ModalAgendamentoComponent, {
      size: 'lg',
      windowClass: 'modal-xl'
    });
    return await modalOpened.result;
  }

}
