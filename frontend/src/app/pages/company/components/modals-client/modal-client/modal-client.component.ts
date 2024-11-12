import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, Input } from '@angular/core';
import { FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClientService } from '../../../../../core/services/client.service';
import { ToasterService } from '../../../../../shared/components/toaster/toaster.service';
import { LoaderService } from '../../../../../shared/components/loader/loader.service';
import { FormErrorType } from '../../../../../shared/components/custom-input/form-error.enum';
import { SharedModule } from '../../../../../shared/shared.module';
import { NgbTooltipModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IClient } from '../../../../../core/models/IClient';
import { cpfCnpjValidator } from '../../../../../shared/Validators/cpf-cnpj.validator';
import { CepService } from '../../../../../core/services/cep.service';

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
      cpfCnpjValidator
    ],
    updateOn: 'blur'
  });

  public cep = new FormControl('', {
    validators: [
      Validators.required,
    ],
    updateOn: 'blur'
  });
  public enderecoRua = new FormControl('', {
    validators: [
      Validators.required,
      Validators.maxLength(100)
    ],
    updateOn: 'blur'
  });

  public enderecoNumero = new FormControl('', {
    validators: [
      Validators.required,
      Validators.pattern(/^\d+$/)
    ],
    updateOn: 'blur'
  });

  public enderecoBairro = new FormControl('', {
    validators: [
      Validators.required,
      Validators.maxLength(100)
    ],
    updateOn: 'blur'
  });

  public enderecoCidade = new FormControl('', {
    validators: [
      Validators.required,
      Validators.maxLength(100)
    ],
    updateOn: 'blur'
  });

  public enderecoEstado = new FormControl('', {
    validators: [
      Validators.required,
      Validators.maxLength(2),
      Validators.pattern(/^[A-Z]{2}$/)
    ],
    updateOn: 'blur'
  });

  public enderecoComplemento = new FormControl('', {
    updateOn: 'blur'
  });

  public errorMessage = '';

  private clientService = inject(ClientService);
  private cepService = inject(CepService);
  private toastService = inject(ToasterService);
  private loader = inject(LoaderService);
  public activeModal = inject(NgbActiveModal);

  public async ngOnInit(): Promise<void> {
    this.setupFormErrorMessages();
    if (this.clientId) {
      await this.loadClient();
    }

    this.enderecoEstado.valueChanges.subscribe(value => {
      if (!value) return;
      this.enderecoEstado.setValue(value.toUpperCase(), { emitEvent: false });
    });

    this.cep.valueChanges.subscribe(async value => {
      if (!this.cep.invalid && !!value) {
        this.loader.show();
        try {
          const cep = await this.cepService.getEnderecoByCep(value.replace(/\D/g, ''));
          if (cep) {
            // this.endereco.setValue(cep.logradouro);
            this.enderecoRua.setValue(cep.logradouro, { emitEvent: false });
            this.enderecoEstado.setValue(cep.uf, { emitEvent: false });
            this.enderecoBairro.setValue(cep.bairro, { emitEvent: false });
            this.enderecoCidade.setValue(cep.localidade, { emitEvent: false });
            // this.enderecoComplemento.setValue(cep.complemento, { emitEvent: false });
            this.enderecoNumero.setValue('', { emitEvent: false });
            
            this.enderecoRua.markAsTouched();
            this.enderecoEstado.markAsTouched();
            this.enderecoBairro.markAsTouched();
            this.enderecoCidade.markAsTouched();
          }
        } catch (error) {
          console.error('Erro ao carregar cep:', error);
          this.toastService.showDanger('Erro ao carregar cep');
        } finally {
          this.loader.hide();
        }
      }
    });

    this.numeroIdentificacao.valueChanges.subscribe(async value => {
      if (!!this.clientId) return;
      if (!this.numeroIdentificacao.invalid && !!value) {
        this.loader.show();

        try {
          const client = await this.clientService.findByNumeroIdentificacao(value.replace(/\D/g, ''));
          if (client) {
            this.clientId = client.id;
            await this.loadClient();
            this.toastService.showSuccess('Cliente encontrado');
            // this.activeModal.close(client);
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
    });
  }

  private async loadClient(): Promise<void> {
    try {
      this.loader.show();
      const client = await this.clientService.getClientById(this.clientId!);
      if (client) {
        this.nomeCompleto.setValue(client.nomeCompleto);
        // this.endereco.setValue(client.endereco);
        this.numeroTelefone.setValue(client.numeroTelefone);
        this.email.setValue(client.email);
        this.dataNascimento.setValue(new Date(client.dataNascimento).toISOString().substring(0, 10));
        this.numeroIdentificacao.setValue(client.numeroIdentificacao, { emitEvent: false });

        this.numeroIdentificacao.disable();
        this.dataNascimento.disable();
        this.nomeCompleto.disable();

        try {
          if( typeof client.endereco == 'string') throw new Error('')
          const {endereco} =  client;
          this.cep.setValue(endereco.cep);
          this.enderecoRua.setValue(endereco.rua);
          this.enderecoNumero.setValue(endereco.numero);
          this.enderecoBairro.setValue(endereco.bairro);
          this.enderecoCidade.setValue(endereco.cidade);
          this.enderecoEstado.setValue(endereco.estado);
          this.enderecoComplemento.setValue(endereco.complemento);
        } catch (error) { // sera removido em breve
          if(typeof client.endereco == 'object') return;
          const enderecoParts = client.endereco.split(',');
          const [rua, numero, cep] = enderecoParts.map(part => part.trim());
  
          this.cep.setValue(cep);
          this.enderecoRua.setValue(rua);
          this.enderecoNumero.setValue(numero);
  
          // Assuming enderecoBairro, enderecoCidade, enderecoEstado, and enderecoComplemento are not available
          this.enderecoBairro.setValue(''); // Replace with appropriate value if available
          this.enderecoCidade.setValue(''); // Replace with appropriate value if available
          this.enderecoEstado.setValue(''); // Replace with appropriate value if available
          this.enderecoComplemento.setValue(''); // Replace with appropriate value if available
        }





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
    });
  }

  public async onSubmit(): Promise<void> {
    if (this.isFormValid()) {
      const endereco = JSON.stringify({
        cep: this.cep.value,
        rua: this.enderecoRua.value,
        numero: this.enderecoNumero.value,
        bairro: this.enderecoBairro.value,
        cidade: this.enderecoCidade.value,
        estado: this.enderecoEstado.value,
        complemento: this.enderecoComplemento.value
      });

      const clientData = {
        nomeCompleto: this.nomeCompleto.value,
        endereco,
        numeroTelefone: this.numeroTelefone.value?.replaceAll(/[^0-9]/g, ''),
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
      this.numeroTelefone.valid &&
      this.email.valid &&
      this.dataNascimento.valid &&
      this.numeroIdentificacao.valid &&
      this.cep.valid &&
      this.enderecoRua.valid &&
      this.enderecoNumero.valid &&
      this.enderecoBairro.valid &&
      this.enderecoCidade.valid &&
      this.enderecoEstado.valid
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

  public ngOnDestroy(): void {
    this.toastService.clear();
  }
}
