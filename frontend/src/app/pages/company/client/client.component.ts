import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClientService } from '../../../core/services/client.service';
import { SharedModule } from '../../../shared/shared.module';
import { ToasterService } from '../../../shared/components/toaster/toaster.service';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { FormErrorType } from '../../../shared/components/custom-input/form-error.enum';
import { ModalClientService } from '../components/modal-client.service';
import { IClient } from '../../../core/models/IClient';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule, NgbTooltipModule, ReactiveFormsModule],
})
export class ClientComponent implements OnInit {
  private modalClientService = inject(ModalClientService);
  private clientHttpService = inject(ClientService);

  public clients: IClient[] = [];

  async ngOnInit(): Promise<void> {
    // Initialization logic here
    await this.getClients();
  }

  public getClients = async () => this.clients = await this.clientHttpService.getAllClients() || [];

  public async openClientModal(): Promise<void> {
    await this.modalClientService.openModal();
    await this.getClients();
  }

  public async openEditClientModal(clientId: number): Promise<void> {
    await this.modalClientService.openModalEdit(clientId);
    await this.getClients();
  }
  
  public async openDeleteClientModal(clientId: number): Promise<void> {
    await this.modalClientService.openModalDelete(clientId);
    await this.getClients();    
  }

}
