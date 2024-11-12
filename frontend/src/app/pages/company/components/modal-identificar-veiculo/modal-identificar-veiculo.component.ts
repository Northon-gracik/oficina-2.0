import { Component, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { cpfCnpjValidator } from '../../../../shared/Validators/cpf-cnpj.validator';
import { ClientService } from '../../../../core/services/client.service';
import { LoaderService } from '../../../../shared/components/loader/loader.service';
import { IClient } from '../../../../core/models/IClient';
import { IOptionSelect } from '../../../../shared/components/select/opitonSelect.model';
import { VehicleService } from '../../../../core/services/vehicle.service';
import { debounceTime } from 'rxjs';
import { ServicoService } from '../../../../core/services/servico.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IServico } from '../../../../core/models/servicosModels';

@Component({
  selector: 'app-modal-identificar-veiculo',
  templateUrl: './modal-identificar-veiculo.component.html',
  styleUrl: './modal-identificar-veiculo.component.scss'
})
export class ModalIdentificarVeiculoComponent {
  cpfCnpjControl = new FormControl('', {
    validators: [
      Validators.required,
      // Validators.pattern(/^\d{11}|\d{14}$/),
      cpfCnpjValidator
    ],
    updateOn: 'blur'
  });
  searchControl = new FormControl('');
  clienteSelecionado: boolean = false;
  veiculoSelecionado: boolean = false;

  cliente?: IClient;
  private clienteId?: number;

  @Input() servicoId?: number;

  steps = [
    { label: 'Identificação do Cliente' },
    { label: 'Selecionar Veículo' },
  ];
  activeIndex = 0;


  public controlSelect = new FormControl();
  public myOptionsSelect: IOptionSelect[] = [];

  constructor(public activeModal: NgbActiveModal, private clientService: ClientService,
    private vehicleService: VehicleService,
    private servicoService: ServicoService,
    private route: ActivatedRoute,
    private loader: LoaderService) { }

    ngOnInit(): void {
    this.cpfCnpjControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(async (value: any) => {
        if ((value.length === 11 || value.length === 14) && (!this.cpfCnpjControl.invalid)) {
          this.loader.show();
          try {
            this.cliente = await this.clientService.findByNumeroIdentificacao(value);
            this.clienteId = this.cliente?.id;
            this.myOptionsSelect = (await this.vehicleService.findByClientId(this.cliente?.id || 0))?.map(
              (vehicle) => ({ label: `${vehicle.marca} ${vehicle.modelo} - ${vehicle.placa}`, value: vehicle.id })) || [];
          } catch (error) {
            this.cliente = undefined;
            this.clienteId = undefined;
            this.myOptionsSelect = [];
            // this.loader.hide();
          } finally {
            this.loader.hide();
          }
        }
      });


    this.searchControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe(async (value: any) => {
        if (value.length >= 3) {
          this.loader.show();
          try {
            this.myOptionsSelect = (await this.vehicleService.findBySearch(value, this.clienteId))?.map(
              (vehicle) => ({ label: `${vehicle.marca} ${vehicle.modelo} - ${vehicle.placa}`, value: vehicle.id })) || [];
          }

          catch (error) {
            this.myOptionsSelect = [];
            // this.loader.hide();
          } finally {
            this.loader.hide();
          }
        }
      });
  }

  public lengthShowDropdown(): number {
    return (this.myOptionsSelect?.length > 0 ? 0 : 3) || 0;
  }

  verificarCliente() {
    // Lógica para verificar o cliente (consulta ao backend)
    if (this.cpfCnpjControl.value) {
      this.clienteSelecionado = true;
      this.activeIndex = 1;
    }
  }

  async adicionarVeiculo() {
    // Lógica para criar ou selecionar o veículo
    try {
      this.veiculoSelecionado = true;
      if(!this.servicoId){
        throw new Error("Serviço não encontrado!");
      }
      await this.servicoService.identificarVeiculo(this.servicoId, this.controlSelect.value);
      this.activeModal.close();
    } catch (error) {
      
    }
  }

  pesquisarVeiculoPorPlaca(placa: string) {
    // Lógica para buscar o veículo pela placa
  }

  fecharModal() {
    this.activeModal.dismiss();
  }

}
