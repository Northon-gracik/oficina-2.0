import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalIdentificarVeiculoComponent } from './modal-identificar-veiculo.component';

@Injectable({
  providedIn: 'root'
})
export class ModalIdentificarVeiculoService {
  constructor(private modalService: NgbModal) {}

  openModal(servicoId: number) {
    const modalRef = this.modalService.open(ModalIdentificarVeiculoComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.servicoId = servicoId;
    return modalRef.result;
  }
}
