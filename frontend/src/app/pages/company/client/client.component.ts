import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClientService } from '../../../core/services/client.service';
import { SharedModule } from '../../../shared/shared.module';
import { ToasterService } from '../../../shared/components/toaster/toaster.service';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { FormErrorType } from '../../../shared/components/custom-input/form-error.enum';
import { ModalClientService } from '../components/modals-client/modal-client.service';
import { IClient, IEndereco } from '../../../core/models/IClient';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule, NgbTooltipModule, ReactiveFormsModule, NgbDropdownModule],
})
export class ClientComponent implements OnInit {
  private modalClientService = inject(ModalClientService);
  private clientHttpService = inject(ClientService);
  private toasterService = inject(ToasterService);
  private loader = inject(LoaderService);

  public actionOptions: { label: string; action: (client: IClient) => void }[] = [];

  public clients: IClient[] = [];

  async ngOnInit(): Promise<void> {
    // Initialization logic here
    await this.getClients();
  }

  public getClients = async () => {
    this.loader.show();
    this.clients = await this.clientHttpService.getAllClients().catch(() => this.toasterService.showDanger('Ocorreu um erro ao buscar os veículos!')) || [];
    this.loader.hide();
  }
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

  public getEndereco = (pEndereco: string | IEndereco) => {
    try {
      const endereco = JSON.parse(pEndereco as string);
      const { cep, rua, numero, bairro, cidade, estado, complemento } = endereco;
      return `
        <div>
          <div class="row">
            <div class="col-4">
              <p><strong>Rua:</strong></p>
              <p><strong>Bairro:</strong></p>
              <p><strong>Cidade:</strong></p>
              <p><strong>CEP:</strong></p>
              <p><strong>Complemento:</strong></p>
            </div>
            <div class="col-8">
              <p>${rua}, ${numero}</p>
              <p>${bairro}</p>
              <p>${cidade} - ${estado}</p>
              <p>${cep}</p>
              <p>${complemento}</p>
            </div>
          </div>
        </div>
      `;
    } catch (error) {
      return `
        <div>
          <div class="row">
            <div class="col-4">
              <p><strong>Endereco:</strong></p>
            </div>
            <div class="col-8">
              <p>${pEndereco}</p>
            </div>
          </div>
        </div>
      `
    }
  }

  public onActionChange = (event: DropdownChangeEvent, client: IClient) => {
    const { value } = event;
    const { action } = value as { label: string; action: (client: IClient) => void };
    action(client);
  };

}
