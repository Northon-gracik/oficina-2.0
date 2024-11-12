import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, Input } from '@angular/core';
import { FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { VehicleService } from '../../../../../core/services/vehicle.service';
import { ToasterService } from '../../../../../shared/components/toaster/toaster.service';
import { LoaderService } from '../../../../../shared/components/loader/loader.service';
import { FormErrorType } from '../../../../../shared/components/custom-input/form-error.enum';
import { SharedModule } from '../../../../../shared/shared.module';
import { NgbTooltipModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IVehicle } from '../../../../../core/models/IVehicle';
import { cpfCnpjValidator } from '../../../../../shared/Validators/cpf-cnpj.validator';
import { ClientService } from '../../../../../core/services/client.service';

@Component({
  selector: 'app-modal-vehicle',
  templateUrl: './modal-vehicle.component.html',
  styleUrl: './modal-vehicle.component.scss',
  standalone: true,
  imports: [CommonModule, SharedModule, NgbTooltipModule, ReactiveFormsModule],
})
export class ModalVehicleComponent implements OnInit {
  @Input() vehicleId: number | null = null;
  cpfCnpjControl = new FormControl('', {
    validators: [
      Validators.required,
      cpfCnpjValidator
    ],
    updateOn: 'blur'
  });
  public clientName = '';

  public marca = new FormControl('', {
    validators: [
      Validators.required,
      Validators.maxLength(50)
    ],
    updateOn: 'blur'
  });
  public modelo = new FormControl('', {
    validators: [
      Validators.required,
      Validators.maxLength(50)
    ],
    updateOn: 'blur'
  });
  public ano = new FormControl('', {
    validators: [
      Validators.required,
      Validators.min(1900),
      Validators.max(new Date().getFullYear() + 1)
    ],
    updateOn: 'blur'
  });
  public km = new FormControl('', {
    validators: [
      Validators.required,
      Validators.min(0),
      Validators.max(999999)
    ],
    updateOn: 'blur'
  });
  public placa = new FormControl('', {
    validators: [
      Validators.required,
      Validators.pattern(/^[A-Z]{3}\d[A-Z]\d{2}$|^[A-Z]{3}\d{4}$/)
    ],
    updateOn: 'blur'
  });
  public numeroChassi = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(17),
      Validators.maxLength(17),
      Validators.pattern(/^[A-HJ-NPR-Z0-9]{17}$/)
    ],
    updateOn: 'blur'
  });
  public cor = new FormControl('', {
    validators: [
      Validators.required,
      Validators.maxLength(20)
    ],
    updateOn: 'blur'
  });
  public clientId = new FormControl('', {
    validators: [
      Validators.required
    ],
    updateOn: 'blur'
  });

  public errorMessage = '';

  private vehicleService = inject(VehicleService);
  private clientService = inject(ClientService);
  private toastService = inject(ToasterService);
  private loader = inject(LoaderService);
  public activeModal = inject(NgbActiveModal);

  public async ngOnInit(): Promise<void> {
    this.setupFormErrorMessages();
    if (this.vehicleId) {
      await this.loadVehicle();
    }

    this.cpfCnpjControl.valueChanges
    .subscribe(async (value: any) => {
      if ((value.length === 11 || value.length === 14) && (!this.cpfCnpjControl.invalid)) {
        this.loader.show();
        try {
          this.clientName = (await this.clientService.findByNumeroIdentificacao(value))?.nomeCompleto || '';
        } finally {
          this.loader.hide();
        }
      }
    });
  }

  private async loadVehicle(): Promise<void> {
    try {
      this.loader.show();
      const vehicle = await this.vehicleService.getVehicleById(this.vehicleId!);
      if (vehicle) {
        this.marca.setValue(vehicle.marca);
        this.modelo.setValue(vehicle.modelo);
        this.ano.setValue(vehicle.ano.toString());
        this.placa.setValue(vehicle.placa);
        this.numeroChassi.setValue(vehicle.numeroChassi);
        this.cor.setValue(vehicle.cor);
        this.cpfCnpjControl.setValue(vehicle.client.numeroIdentificacao, {emitEvent: false});
        this.clientName = vehicle.client.nomeCompleto;
      } else {
        this.toastService.showDanger('Veículo não encontrado');
        this.activeModal.dismiss('Veículo não encontrado');
      }
    } catch (error) {
      console.error('Erro ao carregar veículo:', error);
      this.toastService.showDanger('Erro ao carregar dados do veículo');
    } finally {
      this.loader.hide();
    }
  }

  private setupFormErrorMessages(): void {
    this.marca.setErrors({
      [FormErrorType.Required]: true,
      [FormErrorType.MaxLength]: true
    });
    this.modelo.setErrors({
      [FormErrorType.Required]: true,
      [FormErrorType.MaxLength]: true
    });
    this.ano.setErrors({
      [FormErrorType.Required]: true,
      [FormErrorType.Min]: true,
      [FormErrorType.Max]: true
    });
    this.km.setErrors({
      [FormErrorType.Required]: true,
      [FormErrorType.Min]: true,
      [FormErrorType.Max]: true
    });
    this.placa.setErrors({
      [FormErrorType.Required]: true,
      [FormErrorType.Pattern]: true
    });
    this.numeroChassi.setErrors({
      [FormErrorType.Required]: true,
      [FormErrorType.MinLength]: true,
      [FormErrorType.MaxLength]: true,
      [FormErrorType.Pattern]: true
    });
    this.cor.setErrors({
      [FormErrorType.Required]: true,
      [FormErrorType.MaxLength]: true
    });
    this.clientId.setErrors({
      [FormErrorType.Required]: true
    });
  }

  public async onSubmit(): Promise<void> {
    if (this.isFormValid()) {
      const vehicleData = {
        marca: this.marca.value,
        modelo: this.modelo.value,
        ano: this.ano.value,
        km: this.km.value,
        placa: this.placa.value,
        numeroChassi: this.numeroChassi.value,
        cor: this.cor.value,
        client: { id: parseInt(this.clientId.value!) }
      };

      try {
        this.loader.show();
        let response;
        if (this.vehicleId) {
          response = await this.vehicleService.updateVehicle(this.vehicleId, vehicleData as unknown as IVehicle);
          this.toastService.showSuccess('Veículo atualizado com sucesso');
        } else {
          response = await this.vehicleService.createVehicle(vehicleData as unknown as IVehicle);
          this.toastService.showSuccess('Veículo criado com sucesso');
        }
        console.log('Veículo salvo com sucesso', response);
        this.activeModal.close(response);
      } catch (error: any) {
        console.log(error);
        this.errorMessage = error.error.error ?? 'Ocorreu um erro ao salvar o veículo';
        this.toastService.showDanger(this.errorMessage);
      } finally {
        this.loader.hide();
      }
    } else {
      this.toastService.showDanger('Por favor, corrija os erros no formulário antes de enviar.');
    }
  }

  public isFormValid(): boolean {
    return this.marca.valid &&
           this.modelo.valid &&
           this.ano.valid &&
           this.km.valid &&
           this.placa.valid &&
           this.numeroChassi.valid &&
           this.cor.valid &&
           this.clientId.valid;
  }

  public ngOnDestroy(): void {
    this.toastService.clear();
  }
}
