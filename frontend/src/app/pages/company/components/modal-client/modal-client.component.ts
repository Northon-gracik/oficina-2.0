import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, Input } from '@angular/core';
import { FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClientService } from '../../../../core/services/client.service';
import { ToasterService } from '../../../../shared/components/toaster/toaster.service';
import { LoaderService } from '../../../../shared/components/loader/loader.service';
import { FormErrorType } from '../../../../shared/components/custom-input/form-error.enum';
import { SharedModule } from '../../../../shared/shared.module';
import { NgbTooltipModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IClient } from '../../../../core/models/IClient';

@Component({
  selector: 'app-modal-client',
  templateUrl: './modal-client.component.html',
  styleUrl: './modal-client.component.scss',
  standalone: true,
  imports: [CommonModule, SharedModule, NgbTooltipModule, ReactiveFormsModule],
})
export class ModalClientComponent implements OnInit {
  @Input() clientId: number | null = null;

  public nomeCompleto = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
      Validators.pattern(/^[a-zA-Z\s]*$/)
    ],
    updateOn: 'blur'
  });
  public endereco = new FormControl('', {
    validators: [
      Validators.required,
      Validators.maxLength(200),
      Validators.pattern(/.*\d+.*\d{5}-\d{3}$/)
    ],
    updateOn: 'blur'
  });
  public numeroTelefone = new FormControl('', {
    validators: [
      Validators.required,
      Validators.pattern(/^\d{10,11}$/)
    ],
    updateOn: 'blur'
  });
  public email = new FormControl('', {
    validators: [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ],
    updateOn: 'blur'
  });
  public dataNascimento = new FormControl('', {
    validators: [
      Validators.required,
      this.ageValidator
    ],
    updateOn: 'blur'
  });
  public numeroIdentificacao = new FormControl('', {
    validators: [
      Validators.required,
      Validators.pattern(/^\d{11}|\d{14}$/),
      this.cpfCnpjValidator
    ],
    updateOn: 'blur'
  });

  public errorMessage = '';

  private clientService = inject(ClientService);
  private toastService = inject(ToasterService);
  private loader = inject(LoaderService);
  private activeModal = inject(NgbActiveModal);

  public async ngOnInit(): Promise<void> {
    this.setupFormErrorMessages();
    if (this.clientId) {
      await this.loadClient();
    }
  }

  private async loadClient(): Promise<void> {
    try {
      this.loader.show();
      const client = await this.clientService.getClientById(this.clientId!);
      if (client) {
        this.nomeCompleto.setValue(client.nomeCompleto);
        this.endereco.setValue(client.endereco);
        this.numeroTelefone.setValue(client.numeroTelefone);
        this.email.setValue(client.email);
        this.dataNascimento.setValue(new Date(client.dataNascimento).toISOString().substring(0,10));
        this.numeroIdentificacao.setValue(client.numeroIdentificacao);
      } else {
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

  private setupFormErrorMessages(): void {
    this.nomeCompleto.setErrors({
      [FormErrorType.Required]: true,
      [FormErrorType.MinLength]: true,
      [FormErrorType.MaxLength]: true,
      [FormErrorType.Pattern]: true
    });
    this.endereco.setErrors({
      [FormErrorType.Required]: true,
      [FormErrorType.MaxLength]: true,
      [FormErrorType.Pattern]: true
    });
    this.numeroTelefone.setErrors({
      [FormErrorType.Required]: true,
      [FormErrorType.Pattern]: true
    });
    this.email.setErrors({
      [FormErrorType.Required]: true,
      [FormErrorType.Email]: true,
      [FormErrorType.Pattern]: true
    });
    this.dataNascimento.setErrors({
      [FormErrorType.Required]: true,
      [FormErrorType.InvalidAge]: true
    });
    this.numeroIdentificacao.setErrors({
      [FormErrorType.Required]: true,
      [FormErrorType.Pattern]: true,
      [FormErrorType.InvalidCpfCnpj]: true
    });
  }

  public async onSubmit(): Promise<void> {
    if (this.isFormValid()) {
      const clientData = {
        nomeCompleto: this.nomeCompleto.value,
        endereco: this.endereco.value,
        numeroTelefone: this.numeroTelefone.value,
        email: this.email.value,
        dataNascimento: this.dataNascimento.value,
        numeroIdentificacao: this.numeroIdentificacao.value
      };

      try {
        this.loader.show();
        let response;
        if (this.clientId) {
          response = await this.clientService.updateClient(this.clientId, clientData as unknown as IClient);
          this.toastService.showSuccess('Cliente atualizado com sucesso');
        } else {
          response = await this.clientService.createClient(clientData as unknown as IClient);
          this.toastService.showSuccess('Cliente criado com sucesso');
        }
        console.log('Cliente salvo com sucesso', response);
        this.activeModal.close(response);
      } catch (error: any) {
        console.log(error);
        this.errorMessage = error.error.error ?? 'Ocorreu um erro ao salvar o cliente';
        this.toastService.showDanger(this.errorMessage);
      } finally {
        this.loader.hide();
      }
    } else {
      this.toastService.showDanger('Por favor, corrija os erros no formulário antes de enviar.');
    }
  }

  public isFormValid(): boolean {
    return this.nomeCompleto.valid &&
           this.endereco.valid &&
           this.numeroTelefone.valid &&
           this.email.valid &&
           this.dataNascimento.valid &&
           this.numeroIdentificacao.valid;
  }

  private ageValidator(control: FormControl): { [key: string]: boolean } | null {
    if (control.value) {
      const birthDate = new Date(control.value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18 || age > 120) {
        return { [FormErrorType.InvalidAge]: true };
      }
    }
    return null;
  }

  private cpfCnpjValidator(control: FormControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (value) {
      if (value.length === 11) {
        return this.isValidCPF(value) ? null : { [FormErrorType.InvalidCpfCnpj]: true };
      } else if (value.length === 14) {
        return this.isValidCNPJ(value) ? null : { [FormErrorType.InvalidCpfCnpj]: true };
      }
    }
    return { [FormErrorType.InvalidCpfCnpj]: true };
  }

  private isValidCPF(cpf: string): boolean {
    // Implementar a lógica de validação de CPF aqui
    return true; // Placeholder
  }

  private isValidCNPJ(cnpj: string): boolean {
    // Implementar a lógica de validação de CNPJ aqui
    return true; // Placeholder
  }

  public ngOnDestroy(): void {
    this.toastService.clear();
  }
}
