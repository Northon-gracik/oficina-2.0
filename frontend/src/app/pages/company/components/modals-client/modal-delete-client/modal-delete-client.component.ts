import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientService } from '../../../../../core/services/client.service';
import { ToasterService } from '../../../../../shared/components/toaster/toaster.service';
import { LoaderService } from '../../../../../shared/components/loader/loader.service';
import { IClient } from '../../../../../core/models/IClient';

@Component({
  selector: 'app-modal-delete-client',
  templateUrl: './modal-delete-client.component.html',
  styleUrl: './modal-delete-client.component.scss'
})
export class ModalDeleteClientComponent {
  private clientService = inject(ClientService);
  private toastService = inject(ToasterService);
  private loader = inject(LoaderService);
  public activeModal = inject(NgbActiveModal);
  @Input() clientId: number | null = null;
  private errorMessage: string = '';
  public client?: IClient;
  public clientFirstName: string = '';

  async ngOnInit() {
    try {
      this.loader.show();
      this.client = await this.clientService.getClientById(this.clientId!);
      this.clientFirstName = this.client?.nomeCompleto?.split(' ')[0] || '';
      if (!this.client) {
        this.toastService.showDanger('Cliente não encontrado');
        this.activeModal.dismiss('Cliente não encontrado');
      }
    } catch (error) {
      console.error('Erro ao carregar cliente:', error);
      this.toastService.showDanger('Erro ao carregar dados do cliente');
      // this.activeModal.dismiss('Erro ao carregar cliente');
    } finally {
      this.loader.hide();
    }
  }
  // Método para confirmar exclusão
  async confirmDelete() {
    if (!!this.client) {
      try {
        this.loader.show();
        let response;
        response = await this.clientService.deleteClient(this.client.id);
        this.toastService.showSuccess('Cliente deletado com sucesso');
        this.activeModal.close(response);
      } catch (error: any) {
        console.log(error);
        this.errorMessage = error.error.error ?? 'Ocorreu um erro ao deletar o cliente';
        this.toastService.showDanger(this.errorMessage);
      } finally {
        this.loader.hide();
      }
    }
  }
}
