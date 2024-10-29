import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EntrarComponent } from './login/entrar/entrar.component';
import { CadastroComponent } from './login/cadastro/cadastro.component';
import { DevComponent } from './dev/dev.component';
import { EmpresaComponent } from './login/empresa/empresa.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { AuthCompanyGuard } from '../core/guards/auth-company.guard';
import { noAuthGuard } from '../core/guards/no-auth.guard';
import { noAuthCompanyGuard } from '../core/guards/no-auth-company.guard';
import { UserDetalhesComponent } from './user-detalhes/user-detalhes.component';
import { CompanyDetalhesComponent } from './company-detalhes/company-detalhes.component';
import { ClientComponent } from './company/client/client.component';
import { LayoutCopanyComponent } from '../core/layout/layout-company/layout-company.component';
import { VehicleComponent } from './company/vehicle/vehicle.component';
import { ServicoListagemComponent } from './company/sevico/servico-listagem/servico-listagem.component';
import { ServicoDetalhesComponent } from './company/sevico/servico-detalhes/servico-detalhes.component';
import { AgendamentoComponent } from './company/sevico/agendamento/agendamento.component';
import { InspecaoEntradaComponent } from './company/sevico/inspecao-entrada/inspecao-entrada.component';
import { OrcamentoComponent } from './company/sevico/orcamento/orcamento.component';
import { ManutencaoComponent } from './company/sevico/manutencao/manutencao.component';
import { InspecaoSaidaComponent } from './company/sevico/inspecao-saida/inspecao-saida.component';
import { EntregaComponent } from './company/sevico/entrega/entrega.component';
import { ServicoDetalhesResolver } from '../core/resolvers/servico-detalhes.service';
import { servicoEtapasGuard } from '../core/guards/servico-etapas.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'dev', component: DevComponent },
  { path: 'login', component: EntrarComponent, canActivate: [noAuthGuard], data: { title: 'Login' } },
  { path: 'login/cadastro', component: CadastroComponent, canActivate: [noAuthGuard] },
  { path: 'login/empresa', component: EmpresaComponent, canActivate: [AuthGuard, noAuthCompanyGuard] },
  { path: 'usuario', component: UserDetalhesComponent, canActivate: [AuthGuard] },
  {
    path: 'empresa', component: LayoutCopanyComponent, canActivate: [AuthCompanyGuard], children: [
      { path: '', component: CompanyDetalhesComponent },
      { path: 'cliente', component: ClientComponent },
      { path: 'veiculo', component: VehicleComponent },
      { path: 'servico', component: ServicoListagemComponent },
      {
        path: 'servico/:id',
        component: ServicoDetalhesComponent,
        runGuardsAndResolvers: 'always',
        resolve: {
          servico: ServicoDetalhesResolver
        },
        children: [
          { path: 'agendamento', component: AgendamentoComponent, canActivate: [servicoEtapasGuard] },
          { path: 'inspeção-entrada', component: InspecaoEntradaComponent, canActivate: [servicoEtapasGuard] },
          { path: 'orçamento', component: OrcamentoComponent, canActivate: [servicoEtapasGuard] },
          { path: 'manutenção', component: ManutencaoComponent, canActivate: [servicoEtapasGuard] },
          { path: 'inspeção-saída', component: InspecaoSaidaComponent, canActivate: [servicoEtapasGuard] },
          { path: 'entrega', component: EntregaComponent, canActivate: [servicoEtapasGuard] }
        ],
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
