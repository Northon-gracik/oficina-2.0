import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalClientComponent } from './modal-client/modal-client.component';
import { ModalDeleteClientComponent } from './modal-delete-client/modal-delete-client.component';

@Injectable({
  providedIn: 'root'
})
export class ModalClientService {

  constructor(private modal: NgbModal) { }

  public async openModal(): Promise<void> {
    const modalOpened = this.modal.open(ModalClientComponent, {
      size: 'lg',
      windowClass: 'modal-xl'
    });
    return await modalOpened.result;
  }

  public async openModalEdit(clientId: number): Promise<void> {
    const modalOpened = this.modal.open(ModalClientComponent, {
      size: 'lg',
      windowClass: 'modal-xl'
    });
    modalOpened.componentInstance.clientId = clientId;
    return await modalOpened.result;
  }

  public async openModalDelete(clientId: number): Promise<void> {
    const modalOpened = this.modal.open(ModalDeleteClientComponent, {
      size: 'md',
      windowClass: 'modal-md'
    });
    modalOpened.componentInstance.clientId = clientId;
    return await modalOpened.result;
  }
}
