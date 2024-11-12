import { ModalCriaEmpresaService } from './../../../shared/components/modals/modal-cria-empresa/modal-cria-empresa.service';
import { AuthService } from './../../../core/services/auth.service';
import { UserHttpService } from './../../../core/services/userHttp.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToasterService } from '../../../shared/components/toaster/toaster.service';

interface IEmpresa {
  id: string;
  nome: string;
}
@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
})
export class EmpresaComponent implements OnInit {
  public selectedEmpresaId = new FormControl(null);

  public empresas: IEmpresa[] = [];

  constructor(
    private userHttpService: UserHttpService,
    private authService: AuthService,
    public toasterService: ToasterService,
    private router: Router,
    private modalCriaEmpresaService: ModalCriaEmpresaService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.listCompanies();
  }

  public async onSubmit(event: Event): Promise<void> {
    if (!!this.selectedEmpresaId.value)
      await this.authService.loginInCompany(this.selectedEmpresaId.value);

    try {
      if (!!this.selectedEmpresaId.value) {
        await this.authService.loginInCompany(this.selectedEmpresaId.value);
        this.toasterService.showStandard(
          'Usuário entrou na empresa com sucesso.'
        );
        this.router.navigate(['/empresa/cliente']);
      }
      await this.userHttpService.getCompanyData();
    } catch (error) {
      this.toasterService.showDanger('Ocorreu um erro ao entrar.');
    }
  }

  public isDisabled = () => !this.selectedEmpresaId.value;

  public async openModalCreateCompany() {
    try {
      await this.modalCriaEmpresaService.openModal();
      await this.listCompanies();
    } catch (error) {

      this.toasterService.showDanger('Ocorreu um erro ao entrar.');
    }
  }

  public async listCompanies(): Promise<void>{
    try {
      this.empresas = (await this.userHttpService.getUserData()).roles.map(
        (role: any) => {
          const companyName = role.company.nome;
          const roleName = role.role.replace('ROLE_', '').charAt(0).toUpperCase() + role.role.replace('ROLE_', '').slice(1).toLowerCase();
          
         return {...role.company, nome: `${companyName} (${roleName})`};}
      );
    } catch (error) {

      this.toasterService.showDanger('Ocorreu um erro ao entrar.');
    }
  }
}
