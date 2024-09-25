import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalVehicleComponent } from './modal-vehicle/modal-vehicle.component';
import { ModalDeleteVehicleComponent } from './modal-delete-vehicle/modal-delete-vehicle.component';

@Injectable({
  providedIn: 'root'
})
export class ModalsVehicleService {
  constructor(private modal: NgbModal) { }

  public async openModal(): Promise<void> {
    const modalOpened = this.modal.open(ModalVehicleComponent, {
      size: 'lg',
      windowClass: 'modal-xl'
    });
    return await modalOpened.result;
  }

  public async openModalEdit(vehicleId: number): Promise<void> {
    const modalOpened = this.modal.open(ModalVehicleComponent, {
      size: 'lg',
      windowClass: 'modal-xl'
    });
    modalOpened.componentInstance.vehicleId = vehicleId;
    return await modalOpened.result;
  }

  public async openModalDelete(vehicleId: number): Promise<void> {
    const modalOpened = this.modal.open(ModalDeleteVehicleComponent, {
      size: 'md',
      windowClass: 'modal-md'
    });
    modalOpened.componentInstance.vehicleId = vehicleId;
    return await modalOpened.result;
  }
}
