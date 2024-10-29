import { Component } from '@angular/core';
import { ComponentsCompanyModule } from '../../components/components.module';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ServicoService } from '../../../../core/services/servico.service';
import { IInspecao, IServico } from '../../../../core/models/servicosModels';
import { IVehicle } from '../../../../core/models/IVehicle';
import { LoaderService } from '../../../../shared/components/loader/loader.service';
import { ToasterService } from '../../../../shared/components/toaster/toaster.service';

@Component({
  selector: 'app-inspecao-saida',
  templateUrl: './inspecao-saida.component.html',
  styleUrl: './inspecao-saida.component.scss',
  standalone: true,
  imports: [ComponentsCompanyModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule]
})
export class InspecaoSaidaComponent {
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

  public veiculo?: IVehicle;
  public itensList: { [key: string]: boolean } = {};
  public checklist: FormGroup = new FormGroup({});

  
  public servicoId!: number;

  constructor(private inspecaoService: ServicoService, private route: ActivatedRoute, private router: Router,
    private toaster: ToasterService,
    private loader: LoaderService) { }

  async ngOnInit(): Promise<void> {
    const servico = this.route.parent?.snapshot.data['servico'] as IServico
    this.servicoId = servico.id;
    this.setServicoData(servico);
  }

  async onFormSubmit(inspecao: any | IInspecao) {

    try {
      this.loader.show();

      await this.inspecaoService.realizarInspecaoSaida(this.servicoId, inspecao);

      this.toaster.showSuccess('Inspeção salva com sucesso!');

      this.router.navigate(['empresa/servico', this.route.parent?.snapshot.params['id'], 'entrega']);

    } catch (error) {
      this.toaster.showDanger('Erro ao salvar a inspeção!');
    } finally {
      this.loader.hide();
    }
  }

  public voltar(): void {

    this.router.navigate(['empresa/servico', this.route.parent?.snapshot.params['id'], 'manutenção']);
  }

  public avancar(): void {

    this.router.navigate(['empresa/servico', this.route.parent?.snapshot.params['id'], 'entrega']);
  }


  private async setServicoData(servico: IServico) {
    this.veiculo = servico.vehicle;

    // Garantir que agendamento existe e tem os atributos corretos
    if (servico && servico.inspecaoSaida) {

      const { inspecaoSaida } = servico;

      this.formInspecao.setValue({
        responsavel: inspecaoSaida.responsavelInspecao,
        quilometragem: inspecaoSaida.quilometragem,
        nvlCombustivel: inspecaoSaida.nivelCombustivel,
        comentariosObservacoes: inspecaoSaida.observacoes
      });
      this.formInspecao.get('responsavel')?.disable();
      this.formInspecao.get('quilometragem')?.disable();
      this.formInspecao.get('nvlCombustivel')?.disable();
      this.formInspecao.get('comentariosObservacoes')?.disable();

      this.itensList = inspecaoSaida.checklistInspecao;
    } else if (servico && servico.inspecaoEntrada) {
      this.itensList = servico.inspecaoEntrada.checklistInspecao
    } else {
      // erro, ou nao tem servico, ou nao foi feito inspecao de entrada
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
}
