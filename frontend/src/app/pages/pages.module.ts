import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../shared/shared.module';
import { CadastroComponent } from './login/cadastro/cadastro.component';
import { EntrarComponent } from './login/entrar/entrar.component';
import { DevComponent } from './dev/dev.component';
import { EmpresaComponent } from './login/empresa/empresa.component';
import { UserDetalhesComponent } from './user-detalhes/user-detalhes.component';
import { CompanyDetalhesComponent } from './company-detalhes/company-detalhes.component';
import { ClientComponent } from './company/client/client.component';
import { ModalClientComponent } from './company/components/modal-client/modal-client.component';
import { CustomInputComponent } from '../shared/components/custom-input/custom-input.component';
import { ModalDeleteClientComponent } from './company/components/modal-delete-client/modal-delete-client.component';

@NgModule({
  declarations: [
    UserDetalhesComponent,
    CompanyDetalhesComponent,
    ClientComponent,
    ModalClientComponent,
    ModalDeleteClientComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    PagesRoutingModule,
    ReactiveFormsModule,
    SharedModule, 
    ReactiveFormsModule,
  ],
  exports: [],
})
export class PagesModule { }
