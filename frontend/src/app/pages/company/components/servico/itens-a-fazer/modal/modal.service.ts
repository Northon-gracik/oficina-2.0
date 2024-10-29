import { inject, Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalItemComponent } from './modal-item/modal-item.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private ngModal = inject(NgbModal);

  public showItensModal = async (isPendente: boolean, servicoId: number, screen: 'ORCAMENTO' | 'MANUTENCAO', outhersItemId: number[], itemId?: number,) => {
    const modalRef = this.ngModal.open(ModalItemComponent, {
      windowClass: 'modal-xl',
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.itemId = itemId;
    modalRef.componentInstance.isPendente = isPendente;
    modalRef.componentInstance.servicoId = servicoId;
    modalRef.componentInstance.servicoId = servicoId;
    modalRef.componentInstance.screen = screen;
    modalRef.componentInstance.outhersItemId = outhersItemId;
    return await modalRef.result;
  };
}
