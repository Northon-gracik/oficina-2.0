import { NgModule } from '@angular/core';
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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
