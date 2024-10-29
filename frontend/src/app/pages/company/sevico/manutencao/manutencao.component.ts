import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComponentsCompanyModule } from '../../components/components.module';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ComponentsModule } from '../../../../shared/components/components.module';
import { ServicoService } from '../../../../core/services/servico.service';
import { IItemAFazer, IServico, StatusManutencaoEnum, StatusOrcamentoEnum } from '../../../../core/models/servicosModels';
import { ToasterService } from '../../../../shared/components/toaster/toaster.service';
import { LoaderService } from '../../../../shared/components/loader/loader.service';
@Component({
  selector: 'app-manutencao',
  templateUrl: './manutencao.component.html',
  styleUrl: './manutencao.component.scss',
  standalone: true,
  imports: [ComponentsCompanyModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ComponentsModule]
})
export class ManutencaoComponent implements OnInit {
  public descricaoDetalhada: FormControl = new FormControl('', [Validators.required]);
  public comentariosObservacoes: FormControl = new FormControl('', [Validators.required]);
  public tecnicoResponsavel: FormControl = new FormControl('', [Validators.required]);
  public dataInicio?: Date;
  public dataConclusao?: Date;
  public status: StatusManutencaoEnum = StatusManutencaoEnum.PENDENTE;
  public statusManutencaoEnum = StatusManutencaoEnum;

  public isIniciada: boolean = false;
  public isConcluida: boolean = false;

  public itens: IItemAFazer[] = [];

  public valorTotal: number = 0;

  public servicoId!: number;

  constructor(private servicoService: ServicoService, private route: ActivatedRoute, private router: Router,
    private toaster: ToasterService,
    private loader: LoaderService
  ) { }

  async ngOnInit(): Promise<void> {
    this.loader.show();
    const servico = this.route.parent?.snapshot.data['servico'] as IServico;
    this.servicoId = servico.id;
    await this.loadData(servico);
    this.loader.hide();
  }

  private async loadData(pServico: IServico): Promise<void> {
    try {

      if (pServico && pServico.manutencao) {
        const { manutencao } = pServico;
        this.itens = manutencao.itensAFazer;
        this.descricaoDetalhada.setValue(manutencao.descricaoDetalhada);
        this.comentariosObservacoes.setValue(manutencao.comentariosObservacoes);
        this.tecnicoResponsavel.setValue(pServico.manutencao.tecnicoResponsavel);
        this.valorTotal = manutencao.custosReais;

        this.dataInicio = !!manutencao.dataInicio ? new Date(manutencao?.dataInicio) : undefined;
        this.dataConclusao = !!manutencao.dataConclusao ? new Date(manutencao?.dataConclusao) : undefined;

        this.isIniciada = true;
        this.isConcluida = !!this.dataConclusao;

        if (!!manutencao.dataInicio) {
          if (!!manutencao.dataConclusao) {
            this.status = StatusManutencaoEnum.CONCLUIDA;
          } else this.status = StatusManutencaoEnum.EM_ANDAMENTO;
        } else this.status = StatusManutencaoEnum.PENDENTE;

        this.descricaoDetalhada.disable();
        this.comentariosObservacoes.disable();
        this.tecnicoResponsavel.disable();
      }
    } catch (error) {
      console.error(error);
      this.toaster.showDanger('Erro ao carregar dados da manutenção');
    }
  }


  public async iniciar(): Promise<void> {
    const manutencao = {
      descricaoDetalhada: this.descricaoDetalhada.value,
      comentariosObservacoes: this.comentariosObservacoes.value,
      tecnicoResponsavel: this.tecnicoResponsavel.value,
    };

    this.loader.show();

    try {
      await this.servicoService.iniciarManutencao(this.route.parent?.snapshot.params['id'], manutencao);
      this.refreshServico()
    } catch (error) {
      this.toaster.showDanger('Erro ao iniciar a manutenção!');
    } finally {
      this.loader.hide();
    }
  }

  public refreshServico = async () => {
    if (!this.servicoId) return;
    try {
      const servico = await this.servicoService.getServicoById(this.servicoId)
      if (!servico) {
        this.toaster.showDanger('Serviço não encontrado');

        return;
      }
      await this.loadData(servico);
    } catch (error) {
      this.toaster.showDanger('Erro ao carregar dados da manutenção');
    }
  }

  public voltar(): void {

    this.router.navigate(['empresa/servico', this.route.parent?.snapshot.params['id'], 'orçamento']);
  }

  public avancar(): void {

    this.router.navigate(['empresa/servico', this.route.parent?.snapshot.params['id'], 'inspeção-saída']);
  }

  public async finalizarManutencao(): Promise<void> {
    if (this.itens.filter(item => [StatusManutencaoEnum.EM_ANDAMENTO, StatusManutencaoEnum.PENDENTE].includes(item.statusManutencao)).length > 0) {
      this.toaster.showDanger('Existem itens pendentes na manutenção!');
      return;
    }

    try {
      await this.servicoService.finalizarManutencao(this.servicoId);
      this.toaster.showSuccess('Manutenção finalizada com sucesso.');
      this.router.navigate(['empresa/servico', this.route.parent?.snapshot.params['id'], 'inspeção-saída']);
    } catch (error) {
      this.toaster.showDanger('Erro ao finalizar manutenção');
    }

  }
}
