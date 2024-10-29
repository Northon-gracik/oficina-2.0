import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComponentsCompanyModule } from '../../components/components.module';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ComponentsModule } from '../../../../shared/components/components.module';
import { IServico, StatusOrcamentoEnum, StatusPagamentoEnum } from '../../../../core/models/servicosModels';
import { ServicoService } from '../../../../core/services/servico.service';
import { LoaderService } from '../../../../shared/components/loader/loader.service';
import { ToasterService } from '../../../../shared/components/toaster/toaster.service';

@Component({
  selector: 'app-entrega',
  templateUrl: './entrega.component.html',
  styleUrl: './entrega.component.scss',
  standalone: true,
  imports: [ComponentsCompanyModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ComponentsModule]
})
export class EntregaComponent implements OnInit {
  public valorPago: FormControl = new FormControl('', [Validators.required]);

  public quilometragem: FormControl = new FormControl('', [Validators.required]);
  public comentariosObservacoes: FormControl = new FormControl('', [Validators.required]);
  public tecnicoResponsavel: FormControl = new FormControl('', [Validators.required]);
  public dataEntrega?: Date;
  public isEntregue: boolean = false;
  public valorTotal?: number;
  public statusPagamento: StatusPagamentoEnum = StatusPagamentoEnum.PENDENTE;

  public statusPagamentoEnum = StatusPagamentoEnum;


  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private servicoService: ServicoService,
    private loader: LoaderService,
    private toaster: ToasterService,
  ) { }

  ngOnInit(): void {
    const servico = this.route.parent?.snapshot.data['servico'] as IServico
    this.loadData(servico);
  }

  public async loadData(servico: IServico): Promise<void> {
    if (servico?.entrega) {
      const { entrega } = servico;
      this.isEntregue = true;
      this.dataEntrega = new Date(entrega.dataEntrega);
      this.valorTotal = (servico.custoFinal ?? 0) - (servico.valorPagamento ?? 0);
      this.valorPago.setValidators([Validators.max(this.valorTotal)]);
      this.statusPagamento = servico.statusPagamento;

      this.quilometragem.setValue(entrega.quilometragemEntrega);
      this.comentariosObservacoes.setValue(entrega.observacoesEntrega);
      this.tecnicoResponsavel.setValue(entrega.responsavelEntrega);

      this.quilometragem.disable();
      this.comentariosObservacoes.disable();
      this.tecnicoResponsavel.disable();
    } else {
      this.valorTotal = (servico.custoFinal ?? 0) - (servico.valorPagamento ?? 0);
      this.statusPagamento = servico.statusPagamento;
      this.isEntregue = false;

      this.valorPago.setValidators([Validators.max(this.valorTotal)]);
    }
  }

  public async refreshData(): Promise<void> {
    const servico = await this.servicoService.getServicoById(this.route.parent?.snapshot.params['id']) as IServico;

    await this.loadData(servico);
  }

  public voltar(): void {

    this.router.navigate(['empresa/servico', this.route.parent?.snapshot.params['id'], 'inspeção-saída']);
  }

  public async resgistrarPagamento(): Promise<void>{
    try {
      this.loader.show();
      await this.servicoService.realizarPagamento(this.route.parent?.snapshot.params['id'], this.valorPago.value);
      await this.refreshData();
    } catch (error) {
      this.toaster.showDanger('Erro ao registrar pagamento!');
    } finally {
      this.loader.hide();
    }
  }

  public async registrarEntrega(): Promise<void> {
    try {
      this.loader.show();
      await this.servicoService.finalizarServico(this.route.parent?.snapshot.params['id'], {
        responsavelEntrega: this.tecnicoResponsavel.value,
        observacoesEntrega: this.comentariosObservacoes.value,
        quilometragemEntrega: this.quilometragem.value
      });
      await this.refreshData();
    } catch (error) {
      this.toaster.showDanger('Erro ao registrar entrega!');
    } finally {
      this.loader.hide();
    }
  }
}
