import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../shared/shared.module';
import { CadastroComponent } from './login/cadastro/cadastro.component';
import { EntrarComponent } from './login/entrar/entrar.component';
import { DevComponent } from './dev/dev.component';
import { EmpresaComponent } from './login/empresa/empresa.component';
import { UserDetalhesComponent } from './user-detalhes/user-detalhes.component';
import { CompanyDetalhesComponent } from './company-detalhes/company-detalhes.component';
import { ClientComponent } from './company/client/client.component';
import { ModalClientComponent } from './company/components/modals-client/modal-client/modal-client.component';
import { CustomInputComponent } from '../shared/components/custom-input/custom-input.component';
import { ModalDeleteClientComponent } from './company/components/modals-client/modal-delete-client/modal-delete-client.component';
import { VehicleComponent } from './company/vehicle/vehicle.component';
import { ModalVehicleComponent } from './company/components/modals-vehicle/modal-vehicle/modal-vehicle.component';
import { ModalDeleteVehicleComponent } from './company/components/modals-vehicle/modal-delete-vehicle/modal-delete-vehicle.component';
import { ServicoListagemComponent } from './company/sevico/servico-listagem/servico-listagem.component';
import { ModalAgendamentoComponent } from './company/components/servico/modal-agendamento/modal-agendamento.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from '../shared/components/components.module';
import { ServicoDetalhesComponent } from './company/sevico/servico-detalhes/servico-detalhes.component';
import { InspecaoEntradaComponent } from './company/sevico/inspecao-entrada/inspecao-entrada.component';
import { OrcamentoComponent } from './company/sevico/orcamento/orcamento.component';
import { ManutencaoComponent } from './company/sevico/manutencao/manutencao.component';
import { InspecaoSaidaComponent } from './company/sevico/inspecao-saida/inspecao-saida.component';
import { EntregaComponent } from './company/sevico/entrega/entrega.component';
import { AgendamentoComponent } from './company/sevico/agendamento/agendamento.component';
import { ModalItemComponent } from './company/components/servico/itens-a-fazer/modal/modal-item/modal-item.component';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [
    UserDetalhesComponent,
    CompanyDetalhesComponent,
    ClientComponent,
    ModalClientComponent,
    ModalDeleteClientComponent,
    VehicleComponent,
    ModalVehicleComponent,
    ModalDeleteVehicleComponent,
    ServicoListagemComponent,
    ModalAgendamentoComponent,
    ServicoDetalhesComponent,
    InspecaoEntradaComponent,
    OrcamentoComponent,
    ManutencaoComponent,
    InspecaoSaidaComponent,
    EntregaComponent,
    AgendamentoComponent,
    ModalItemComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    PagesRoutingModule,
    ReactiveFormsModule,
    SharedModule, 
    ReactiveFormsModule,
    NgbModalModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
  ],
  exports: [],
})
export class PagesModule { }
