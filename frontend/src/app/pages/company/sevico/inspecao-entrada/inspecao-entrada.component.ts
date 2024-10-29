import { Component } from '@angular/core';
import { ServicoService } from '../../../../core/services/servico.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormularioInspecaoComponent } from '../../components/servico/formulario-inspecao/formulario-inspecao.component';
import { CommonModule } from '@angular/common';
import { ComponentsCompanyModule } from '../../components/components.module';
import { IInspecao, IServico } from '../../../../core/models/servicosModels';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IVehicle } from '../../../../core/models/IVehicle';
import { ToasterService } from '../../../../shared/components/toaster/toaster.service';
import { LoaderService } from '../../../../shared/components/loader/loader.service';

@Component({
  selector: 'app-inspecao-entrada',
  templateUrl: './inspecao-entrada.component.html',
  styleUrl: './inspecao-entrada.component.scss',
  standalone: true,
  imports: [ComponentsCompanyModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule]
})
export class InspecaoEntradaComponent {
  public responsavel: FormControl = new FormControl('', [Validators.required]);
  public quilometragem: FormControl = new FormControl('', [Validators.required]);
  public nvlCombustivel: FormControl = new FormControl('', [Validators.required]);
  public comentariosObservacoes: FormControl = new FormControl('');
  public formInspecao: FormGroup = new FormGroup({
    responsavel: this.responsavel,
    quilometragem: this.quilometragem,
    nvlCombustivel: this.nvlCombustivel,
    comentariosObservacoes: this.comentariosObservacoes
  });

  public itensList: { [key: string]: boolean } = {};
  public veiculo?: IVehicle;
  public checklist: FormGroup = new FormGroup({});

  isDisabled: boolean = false; // Controle de desabilitação

  public servicoId!: number;

  constructor(
    private inspecaoService: ServicoService,
    private route: ActivatedRoute,
    private router: Router,
    private toaster: ToasterService,
    private loader: LoaderService
  ) { }

  async ngOnInit(): Promise<void> {
    const servico = this.route.parent?.snapshot.data['servico'] as IServico
    this.servicoId = servico.id;
    this.setServicoData(servico);
  }

  private async setServicoData(servico: IServico) {
    this.veiculo = servico.vehicle;

    // Garantir que agendamento existe e tem os atributos corretos
    if (servico && servico.inspecaoEntrada) {
      const { inspecaoEntrada } = servico;

      this.formInspecao.setValue({
        responsavel: inspecaoEntrada.responsavelInspecao,
        quilometragem: inspecaoEntrada.quilometragem,
        nvlCombustivel: inspecaoEntrada.nivelCombustivel,
        comentariosObservacoes: inspecaoEntrada.observacoes
      });
      this.formInspecao.get('responsavel')?.disable();
      this.formInspecao.get('quilometragem')?.disable();
      this.formInspecao.get('nvlCombustivel')?.disable();
      this.formInspecao.get('comentariosObservacoes')?.disable();

      this.itensList = inspecaoEntrada.checklistInspecao;
    } else {
      this.itensList = (await this.inspecaoService.getListItemInspecao() as string[]).reduce((acc, curr) => {
        acc[curr] = false;
        return acc;
      }, {} as { [key: string]: boolean });
    }
  }

  async onFormSubmit(inspecao: any | IInspecao) {

    try {
      this.loader.show();

      await this.inspecaoService.realizarInspecaoEntrada(this.servicoId, inspecao);

      this.toaster.showSuccess('Inspeção salva com sucesso!');

      this.router.navigate(['empresa/servico', this.route.parent?.snapshot.params['id'], 'orçamento']);

    } catch (error) {
      this.toaster.showDanger('Erro ao salvar a inspeção!');
    } finally {
      this.loader.hide();
    }
  }

  public refreshServico = async () => {
    try {
      const servico = await this.inspecaoService.getServicoById(this.servicoId)
      if (!servico) throw new Error('Serviço não encontrado');
      await this.setServicoData(servico);
    } catch (error) {

    }
  }

  public voltar(): void {

    this.router.navigate(['empresa/servico', this.route.parent?.snapshot.params['id'], 'agendamento']);
  }

  public avancar(): void {

    this.router.navigate(['empresa/servico', this.route.parent?.snapshot.params['id'], 'orçamento']);
  }

}
