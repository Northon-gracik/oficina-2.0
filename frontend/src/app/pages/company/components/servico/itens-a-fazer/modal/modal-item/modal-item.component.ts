import { Component, inject, Input, OnInit, Output } from '@angular/core';
import { IItemAFazer, IPeca, IServico, StatusManutencaoEnum } from '../../../../../../../core/models/servicosModels';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EventEmitter } from 'stream';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../../../../../../shared/components/loader/loader.service';
import { ServicoService } from '../../../../../../../core/services/servico.service';
import { ToasterService } from '../../../../../../../shared/components/toaster/toaster.service';

@Component({
  selector: 'app-modal-item',
  templateUrl: './modal-item.component.html',
  styleUrl: './modal-item.component.scss'
})
export class ModalItemComponent implements OnInit {
  public descricao: FormControl = new FormControl('', Validators.required);
  public tipoMecanico: FormControl = new FormControl('', Validators.required);
  public tipoManutencao: FormControl = new FormControl('', Validators.required);
  public valorMaoDeObra: FormControl = new FormControl('', Validators.required);
  public status: StatusManutencaoEnum = StatusManutencaoEnum.PENDENTE;
  public valorTotalPecas: number = 0;
  public itemId?: number;
  public isPendente: boolean = true;
  public screen!: 'ORCAMENTO' | 'MANUTENCAO';

  public servicoId!: number;
  public outhersItemId: number[] = [];

  time = { hour: 1, minute: 0 };

  public isCreated: boolean = false;

  public statusManutencaoEnum = StatusManutencaoEnum;

  public isCollapsed: boolean = false;

  public formStatus: FormControl = new FormControl('');

  // Lista de peças
  public pecas: IPeca[] = [];

  // FormControls para adicionar nova peça
  public pecaNome = new FormControl('');
  public pecaQuantidade = new FormControl(1);
  public pecaValorUnitario = new FormControl(0);
  public pecaDescricao = new FormControl('');
  public pecaPartNumber = new FormControl('');

  private activeModal = inject(NgbActiveModal);
  private loader = inject(LoaderService);
  private servicoService = inject(ServicoService);
  private toaster = inject(ToasterService);

  public onClose = () => this.activeModal.close();

  public onSubmit = () => this.activeModal.close();

  async ngOnInit(): Promise<void> {
    await this.loadItem();
  }

  public isValid = () => !this.descricao.invalid &&
    !this.tipoMecanico.invalid &&
    !this.tipoManutencao.invalid &&
    !this.valorMaoDeObra.invalid && this.isTimeInvalid();

  public isTimeInvalid = () => (this.time.hour > 0 || this.time.minute > 0);


  public async criarItem(): Promise<void> {
    this.loader.show();
    try {
      const tempoEstimadoISO = `PT${this.time.hour}H${this.time.minute}M`;
      const item: any | IItemAFazer = {
        descricao: this.descricao.value,
        tipoMecanico: this.tipoMecanico.value,
        tipoManutencao: this.tipoManutencao.value,
        valorMaoDeObra: Number(this.valorMaoDeObra.value),
        tempoEstimado: tempoEstimadoISO
      };
      console.log(this.servicoId);
      if(this.screen === 'ORCAMENTO') {
        await this.servicoService.inserirItemOrcamento(this.servicoId, item);
        const servico = await this.servicoService.getServicoById(this.servicoId);
        
        const newItemId = servico?.orcamento.itensAFazer.filter(item => this.outhersItemId.includes(item.id))[0].id;
        if(!newItemId) return;
        this.itemId = newItemId;
      } else {
        await this.servicoService.inserirItemManutencao(this.servicoId, item);
        const servico = await this.servicoService.getServicoById(this.servicoId);

        const newItemId = servico?.manutencao.itensAFazer.filter(item => this.outhersItemId.includes(item.id))[0].id;
        if(!newItemId) return;
        this.itemId = newItemId;
      }

      await this.loadItem();
      // this.activeModal.close();
    } catch (error) {
      this.loader.hide();
      this.toaster.showDanger('Erro ao criar item!');
    } finally {
      this.loader.hide();
    }
  }

  public loadItem = async (): Promise<void> => {
    if (!this.itemId) return;

    try {
      this.loader.show();
      const item = await this.servicoService.getItem(this.itemId);

      if (!item) return;
      this.descricao.setValue(item.descricao);
      this.tipoMecanico.setValue(item.tipoMecanico);
      this.tipoManutencao.setValue(item.tipoManutencao);
      this.valorMaoDeObra.setValue(item.valorMaoDeObra + '');
      this.formStatus.setValue(item.statusManutencao);
      this.status = item.statusManutencao;
      this.valorTotalPecas = item.valorTotalPecas;

      this.descricao.disable();
      this.tipoMecanico.disable();
      this.tipoManutencao.disable();
      this.valorMaoDeObra.disable();

      const tempo = item?.tempoEstimado || 0;

      const hour = Math.floor(tempo / 3600);
      const minute = Math.floor((tempo % 3600) / 60);

      this.time = { hour, minute }

      this.pecas = item.pecas;

      this.isCreated = true;

      this.isPendente = [StatusManutencaoEnum.PENDENTE, this.statusManutencaoEnum.EM_ANDAMENTO].includes(item.statusManutencao);
    } catch (error: any) {
      console.error(error);
    } finally {
      this.loader.hide();
    }
  }

  // Adiciona uma peça à lista de peças
  async adicionarPeca() {
    if (!this.itemId) return;

    const { value: nome } = this.pecaNome;
    const { value: descricao } = this.pecaDescricao;
    const { value: valorUnitario } = this.pecaValorUnitario;
    const { value: quantidade } = this.pecaQuantidade;
    const { value: partNumber } = this.pecaPartNumber;

    const novaPeca: Omit<IPeca, 'id'> = {
      nome: nome || '',
      descricao: descricao || '',
      valorUnitario: Number(valorUnitario),
      quantidade: Number(quantidade),
      partNumber: partNumber || '',
    };

    try {
      this.loader.show();
      if(this.screen === 'ORCAMENTO') {
        
        await this.servicoService.inserirPecaItemOrcamento(this.servicoId, this.itemId, novaPeca);
      } else {
        await this.servicoService.inserirPecaItemManutencao(this.servicoId, this.itemId, novaPeca);

      }
      await this.loadItem();
      this.toaster.showSuccess('Peça adicionada ao orçamento!');
      this.pecaNome.reset();
      this.pecaDescricao.reset();
      this.pecaValorUnitario.reset();
      this.pecaQuantidade.reset();
      this.pecaPartNumber.reset();

      this.isCollapsed = false;
    } catch (error) {
      console.error('Erro ao inserir peça no orçamento:', error);
      this.toaster.showDanger('Erro ao adicionar peça ao orçamento!');
    } finally {
      this.loader.hide();
    }
  }

  // Remove uma peça da lista
  removerPeca(index: number) {
    this.pecas.splice(index, 1);
  }

  public mudarStatus(status: any): void {

    console.log(
      this.formStatus.value
    );

  }

  public async iniciarItem(): Promise<void> {
    if (!this.itemId) return;
    try {
      await this.servicoService.mudarStatusItem(this.itemId, StatusManutencaoEnum.EM_ANDAMENTO);
      this.toaster.showSuccess('Item iniciado com sucesso!');
    } catch (error) {
      this.toaster.showDanger('Erro ao iniciar item!');
    }

    await this.loadItem();
  }

  public async concluirItem(): Promise<void> {
    if (!this.itemId) return;
    try {
      await this.servicoService.mudarStatusItem(this.itemId, StatusManutencaoEnum.CONCLUIDA);
      this.toaster.showSuccess('Item concluído com sucesso!');
    } catch (error) {
      this.toaster.showDanger('Erro ao concluir item!');
    }

    await this.loadItem();
  }

  public async cancelarItem(): Promise<void> {
    if (!this.itemId) return;
    try {
      await this.servicoService.mudarStatusItem(this.itemId, StatusManutencaoEnum.CANCELADA);
      this.toaster.showSuccess('Item cancelado com sucesso!');
    } catch (error) {
      this.toaster.showDanger('Erro ao cancelar item!');
    }

    await this.loadItem();
  }
}