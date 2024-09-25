import { Component, inject, Input } from '@angular/core';
import { ToasterService } from '../../../../../shared/components/toaster/toaster.service';
import { LoaderService } from '../../../../../shared/components/loader/loader.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IVehicle } from '../../../../../core/models/IVehicle';
import { VehicleService } from '../../../../../core/services/vehicle.service';

@Component({
  selector: 'app-modal-delete-vehicle',
  templateUrl: './modal-delete-vehicle.component.html',
  styleUrl: './modal-delete-vehicle.component.scss'
})
export class ModalDeleteVehicleComponent {
  private vehicleService = inject(VehicleService);
  private toastService = inject(ToasterService);
  private loader = inject(LoaderService);
  public activeModal = inject(NgbActiveModal);
  @Input() vehicleId: number | null = null;
  private errorMessage: string = '';
  public vehicle?: IVehicle;
  public vehicleDescripition: string = '';

  async ngOnInit() {
    try {
      this.loader.show();
      this.vehicle = await this.vehicleService.getVehicleById(this.vehicleId!);
      this.vehicleDescripition = this.vehicle?.marca + ' ' + this.vehicle?.modelo + ' - ' + this.vehicle?.placa || '';
      if (!this.vehicle) {
        this.toastService.showDanger('Cliente não encontrado');
        this.activeModal.dismiss('Cliente não encontrado');
      }
    } catch (error) {
      this.toastService.showDanger('Erro ao carregar dados do veículo');
      // this.activeModal.dismiss('Erro ao carregar cliente');
    } finally {
      this.loader.hide();
    }
  }
  // Método para confirmar exclusão
  async confirmDelete() {
    if (!!this.vehicle) {
      try {
        this.loader.show();
        let response;
        response = await this.vehicleService.deleteVehicle(this.vehicle.id);
        this.toastService.showSuccess('Veículo deletado com sucesso');
        this.activeModal.close(response);
      } catch (error: any) {
        console.log(error);
        this.errorMessage = error.error.error ?? 'Ocorreu um erro ao deletar o veículo';
        this.toastService.showDanger(this.errorMessage);
      } finally {
        this.loader.hide();
      }
    }
  }
}
