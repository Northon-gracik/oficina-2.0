import { Component, inject, OnInit } from '@angular/core';
import { VehicleService } from '../../../core/services/vehicle.service';
import { IVehicle } from '../../../core/models/IVehicle';
import { ToasterService } from '../../../shared/components/toaster/toaster.service';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { ModalsVehicleService } from '../components/modals-vehicle/modals-vehicle.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss',
  standalone: true,
  imports: [CommonModule, SharedModule, NgbTooltipModule, ReactiveFormsModule],
})
export class VehicleComponent implements OnInit {
  private modalVehicleService = inject(ModalsVehicleService);
  private vehicleHttpService = inject(VehicleService);
  private toasterService = inject(ToasterService);
  private loader = inject(LoaderService);

  public vehicles: IVehicle[] = [];

  async ngOnInit(): Promise<void> {
    // Initialization logic here
    await this.getVehicles();
  }

  public getVehicles = async () => {
    this.loader.show();
    this.vehicles = await this.vehicleHttpService.getAllVehicles().catch(() => this.toasterService.showDanger('Ocorreu um erro ao buscar os veículos!')) || [];
    this.loader.hide();
    console.log(this.vehicles);
    
  }

  public async openClientModal(): Promise<void> {
    await this.modalVehicleService.openModal();
    await this.getVehicles();
  }

  public async openEditClientModal(vehicleId: number): Promise<void> {
    await this.modalVehicleService.openModalEdit(vehicleId);
    await this.getVehicles();
  }

  public async openDeleteClientModal(vehicleId: number): Promise<void> {
    await this.modalVehicleService.openModalDelete(vehicleId);
    await this.getVehicles();
  }

}