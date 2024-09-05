import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ToasterService } from '../../toaster/toaster.service';
import { AuthService } from '../../../../core/services/auth.service';
import { UserHttpService } from '../../../../core/services/userHttp.service';
import { ICreateCompany } from '../../../../core/models/userModels';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-cria-empresa',
  templateUrl: './modal-cria-empresa.component.html',
  styleUrl: './modal-cria-empresa.component.scss'
})
export class ModalCriaEmpresaComponent {
  public nomeEmpresa = new FormControl('', [Validators.required]);
  public cnpjEmpresa = new FormControl('', [Validators.required]);

  constructor (
    private userHttp: UserHttpService,
    private authService: AuthService,
    private toasterService: ToasterService,
    private activedModal: NgbActiveModal) { }

  public async onSubmit() {
    // event.preventDefault();
    if( this.nomeEmpresa.value === null || this.cnpjEmpresa.value === null){
      return;
    }
    const companyData: ICreateCompany = {
      nome: this.nomeEmpresa.value,
      cnpj: this.cnpjEmpresa.value,
    };

    try {
      await this.authService.createCompany(companyData);
      this.toasterService.showStandard('Novo empresa cadastrado.');
      this.activedModal.close();
    } catch (error) {
      this.toasterService.showDanger('Ocorreu um erro ao salvar usuário.');
    }
  }
}
