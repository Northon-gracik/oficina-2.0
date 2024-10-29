import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { NgbAccordionModule, NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { LoaderService } from '../../../../shared/components/loader/loader.service';
import { ToasterService } from '../../../../shared/components/toaster/toaster.service';
import { formatServicoToListagem, IServico, IServicoListagem } from '../../../../core/models/servicosModels';
import { ServicoService } from '../../../../core/services/servico.service';
import { ModalAgendamentoService } from '../../components/servico/modal-agendamento/modal-agendamento.service';
import { Router } from '@angular/router'


@Component({
  selector: 'app-servico-listagem',
  templateUrl: './servico-listagem.component.html',
  styleUrl: './servico-listagem.component.scss',
  standalone: true,
  imports: [CommonModule, SharedModule, NgbTooltipModule, NgbAccordionModule, NgbAccordionModule, ReactiveFormsModule],
})
export class ServicoListagemComponent implements OnInit {
  private modalAgendamentoService = inject(ModalAgendamentoService);
  private servicoHttpService = inject(ServicoService);
  private toasterService = inject(ToasterService);
  private loader = inject(LoaderService);
  private router = inject(Router);

  public servicos: IServicoListagem[] = [];

  async ngOnInit(): Promise<void> {
    // Initialization logic here
    await this.getClients();
  }

  public getClients = async (): Promise<void> => {
    this.loader.show();
    this.servicos =  await this.servicoHttpService.getAllServicos()
      .then(servicos => servicos?.map(formatServicoToListagem)) 
      .catch(() => this.toasterService.showDanger('Ocorreu um erro ao buscar os veículos!'))|| [];
    this.loader.hide();
  }

  public async openAgendamentoModal(): Promise<void> {
    await this.modalAgendamentoService.openModal();
    await this.getClients();
  }

  public async openEditClientModal(clientId: number): Promise<void> {
    // await this.modalClientService.openModalEdit(clientId);
    await this.getClients();
  }
  
  public async openDeleteClientModal(clientId: number): Promise<void> {
    // await this.modalClientService.openModalDelete(clientId);
    await this.getClients();    
  }

  public verDetalhes(servicoId: number) {
    this.router.navigate(['empresa/servico', servicoId, 'inspeção-entrada']);
  }
}

