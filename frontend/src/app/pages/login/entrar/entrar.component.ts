import { LoaderService } from './../../../shared/components/loader/loader.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { Route, Router, RouterModule } from '@angular/router';
import { ToasterService } from '../../../shared/components/toaster/toaster.service';
import { UserHttpService } from '../../../core/services/userHttp.service';
import { ILoginUser } from '../../../core/models/userModels';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-entrar',
  templateUrl: './entrar.component.html',
  styleUrl: './entrar.component.scss',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule, HttpClientModule],
})
export class EntrarComponent {
  public email = new FormControl('admin@admin.com', [
    Validators.required,
    Validators.email,
  ]);
  public password = new FormControl('senha123', [
    Validators.required,
    Validators.minLength(8),
  ]);

  constructor(
    private userHttp: UserHttpService,
    private authService: AuthService,
    private toasterService: ToasterService,
    private loader: LoaderService,
    private router: Router
  ) {}

  async onSubmit(event: Event) {
    event.preventDefault();
    this.loader.show();
    if (!this.email.value || !this.password.value) return;

    const userData: ILoginUser = {
      email: this.email.value,
      password: this.password.value,
    };

    try {
      await this.authService.login(userData);
      this.toasterService.showStandard('Usuário entrou com sucesso.');
      this.router.navigate(['/login/empresa']);
    } catch (error) {
      this.toasterService.showDanger('Ocorreu um erro ao entrar.');
    } finally {
      this.loader.hide();
    }
  }

  public isValid = () => this.email.valid && this.password.valid;
}
