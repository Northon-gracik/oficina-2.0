import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { camelCaseToFrontendStyle } from '../../../../../shared/util/stringUtil';
import { IVehicle } from '../../../../../core/models/IVehicle';
import { ModalIdentificarVeiculoService } from '../../modal-identificar-veiculo/modal-identificar-veiculo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IInspecao } from '../../../../../core/models/servicosModels';

@Component({
  selector: 'app-formulario-inspecao',
  templateUrl: './formulario-inspecao.component.html',
  styleUrl: './formulario-inspecao.component.scss'
})
export class FormularioInspecaoComponent implements OnChanges {

  @Input() formInspecao?: FormGroup;
  @Input() itensList: { [key: string]: boolean } = {};
  @Input() checklist?: FormGroup; // Checklist vindo do pai
  @Input() servicoId!: number;
  @Input() veiculo?: IVehicle;
  @Output() submit = new EventEmitter<Omit<IInspecao, 'id'>>(); // Emitir o formulário quando enviado
  @Output() voltar = new EventEmitter<void>(); // Emitir o formulário quando enviado
  @Output() avancar = new EventEmitter<void>(); // Emitir o formulário quando enviado

  @Output() refreshServico = new EventEmitter<void>();

  constructor(private modalVeiculo: ModalIdentificarVeiculoService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  ngOnChanges(): void {
    Object.keys(this.itensList).forEach((item: string) =>
      this.checklist?.addControl(item, new FormControl(this.itensList[item])));

    if (this.formInspecao?.enabled) Object.values(this.checklist?.controls || {}).forEach(control => control.enable());
    else Object.values(this.checklist?.controls || {}).forEach(control => control.disable());
  }

  public getFormControl = (item: string, group?: FormGroup): FormControl => group?.get(item) as FormControl || new FormControl('');

  public getKeys = (): string[] => Object.keys(this.itensList);

  public camelCaseFormat = camelCaseToFrontendStyle;

  public abrirModalVeiculo = async () => {
    await this.modalVeiculo.openModal(this.servicoId);
    this.refreshServico.emit();
  };

  getValue = (): Omit<IInspecao, 'id'> => ({
    checklistInspecao: this.checklist?.value,
    dataInspecao: new Date(),
    nivelCombustivel: this.formInspecao?.get('nvlCombustivel')?.value,
    responsavelInspecao: this.formInspecao?.get('responsavel')?.value,  
    quilometragem: Number(this.formInspecao?.get('quilometragem')?.value),
    observacoes: this.formInspecao?.get('comentariosObservacoes')?.value
  });

  public onSubmit(): void{    
    this.submit.emit(
      this.getValue()
    );
  } 
}
