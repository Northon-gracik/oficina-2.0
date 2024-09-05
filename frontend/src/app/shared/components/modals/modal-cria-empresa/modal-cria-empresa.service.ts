import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalCriaEmpresaComponent } from './modal-cria-empresa.component';

@Injectable({
  providedIn: 'root'
})
export class ModalCriaEmpresaService {

  constructor(private modal: NgbModal) { }

  public async openModal(): Promise<void>{
    const modalOpened = this.modal.open(ModalCriaEmpresaComponent);
    return await modalOpened.result
  }
}
