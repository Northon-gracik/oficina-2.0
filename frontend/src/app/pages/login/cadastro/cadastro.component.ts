import { LoaderService } from './../../../shared/components/loader/loader.service';
import { AuthService } from './../../../core/services/auth.service';
import { ToasterService } from './../../../shared/components/toaster/toaster.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { FormErrorType } from '../../../shared/components/custom-input/form-error.enum';
import { MatchValidator } from '../../../shared/components/custom-input/validators/MatchValidator';
import { UserHttpService } from '../../../core/services/userHttp.service';
import { ICreateUser } from '../../../core/models/userModels';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss',
  standalone: true,
  imports: [CommonModule, SharedModule, HttpClientModule],
})
export class CadastroComponent implements OnInit {
  public name = new FormControl('', [Validators.required]);
  public email = new FormControl('', [Validators.required, Validators.email]);
  public password = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);
  public confirmPassword = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
    MatchValidator(this.password),
  ]);

  public cpf = new FormControl('', [Validators.required]);

  constructor(
    private userHttp: UserHttpService,
    private authService: AuthService,
    private toasterService: ToasterService,
    private loader: LoaderService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  async onSubmit(event: Event) {
    event.preventDefault();
    this.loader.show();

    const userData: ICreateUser= {
      nome: this.name.value || '',
      email: this.email.value || '',
      password: this.password.value || '',
      cpf: this.cpf.value || '',
    };

    try {
      await this.authService.createUser(userData );
      this.router.navigate(['/login/empresa']);
      this.toasterService.showStandard('Novo usuário cadastrado.');
    } catch (error) {
      this.toasterService.showDanger('Ocorreu um erro ao salvar usuário.');
    } finally {
      this.loader.hide();
    }
  }

  public isValid(): boolean {
    return (
      this.name.valid &&
      this.email.valid &&
      this.password.valid &&
      this.confirmPassword.valid &&
      this.cpf.valid
    );
  }

  public navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
