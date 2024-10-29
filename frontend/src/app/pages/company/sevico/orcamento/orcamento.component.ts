import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComponentsCompanyModule } from '../../components/components.module';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ComponentsModule } from '../../../../shared/components/components.module';
import { ServicoService } from '../../../../core/services/servico.service';
import { IItemAFazer, IManutencao, IOrcamento, IServico, StatusOrcamentoEnum } from '../../../../core/models/servicosModels';
import { ToasterService } from '../../../../shared/components/toaster/toaster.service';
import { LoaderService } from '../../../../shared/components/loader/loader.service';

@Component({
  selector: 'app-orcamento',
  templateUrl: './orcamento.component.html',
  styleUrl: './orcamento.component.scss',
  standalone: true,
  imports: [ComponentsCompanyModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ComponentsModule]
})
export class OrcamentoComponent implements OnInit {
  public dataPrevista: FormControl = new FormControl('', [Validators.required]);
  public dataValidade: FormControl = new FormControl('', [Validators.required]);
  public responsavelEmissao: FormControl = new FormControl('', [Validators.required]);
  public status: StatusOrcamentoEnum = StatusOrcamentoEnum.PENDENTE;
  public statusOrcamentoEnum = StatusOrcamentoEnum;

  public itens: IItemAFazer[] = [];

  public valorTotal: number = 0;

  public isCreated: boolean = false;
  public servicoId!: number;

  constructor(private servicoService: ServicoService, private route: ActivatedRoute, private router: Router,
    private toaster: ToasterService,
    private loader: LoaderService) { }

  async ngOnInit(): Promise<void> {
    const servico = this.route.parent?.snapshot.data['servico'] as IServico
    this.servicoId = servico.id;
    this.setServicoData(servico);
  }

  private setServicoData(pServico: IServico): void {
    if (pServico && pServico.orcamento) {
      const { orcamento } = pServico;
      this.itens = orcamento.itensAFazer;
      this.dataPrevista.setValue(new Date(orcamento.dataPrevista).toISOString().substring(0, 10));
      this.dataValidade.setValue(new Date(orcamento.dataValidade).toISOString().substring(0, 10));
      this.responsavelEmissao.setValue(pServico.orcamento.responsavelEmissao);
      this.valorTotal = orcamento.custoTotalEstimado || 0;
      this.status = orcamento.status;

      this.dataPrevista.disable();
      this.dataValidade.disable();
      this.responsavelEmissao.disable();

      this.isCreated = true;
    }
  }

  public refreshServico = async () => {
    if(!this.servicoId) return;
    try {
      const servico = await this.servicoService.getServicoById(this.servicoId)
      if (!servico) throw new Error('Serviço não encontrado');
      await this.setServicoData(servico);
    } catch (error) {

    }
  }

  async onFormSubmit(inspecao: any | IManutencao) {
    if(!this.servicoId) return;

    try {
      this.loader.show();

      await this.servicoService.realizarInspecaoEntrada(this.servicoId, inspecao);

      this.toaster.showSuccess('Orçamento iniciado com sucesso!');
      


    } catch (error) {
      this.toaster.showDanger('Erro ao iniciar o orçamento!');
    } finally {
      this.loader.hide();
    }
  }
  public async iniciar (): Promise<void> {

    const orcamento = {
      dataPrevista: this.dataPrevista.value,
      dataValidade: this.dataValidade.value,
      responsavelEmissao: this.responsavelEmissao.value
    }

    console.log({orcamento});
    

    if(!this.servicoId) return;

    try {
      this.loader.show();

      await this.servicoService.criarOrcamento(this.servicoId, orcamento);

      this.toaster.showSuccess('Orçamento iniciado com sucesso!');
      
      await this.refreshServico();
    } catch (error) {
      this.toaster.showDanger('Erro ao iniciar o orçamento!');
    } finally {
      this.loader.hide();
    }
  }

  public voltar(): void {

    this.router.navigate(['empresa/servico', this.route.parent?.snapshot.params['id'], 'inspeção-entrada']);
  }

  public avancar(): void {

    this.router.navigate(['empresa/servico', this.route.parent?.snapshot.params['id'], 'manutenção']);
  }
}
