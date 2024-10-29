import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IItemAFazer } from '../../../../../core/models/servicosModels';
import { ModalService } from './modal/modal.service';




@Component({
  selector: 'app-itens-a-fazer',
  templateUrl: './itens-a-fazer.component.html',
  styleUrls: ['./itens-a-fazer.component.scss']
})
export class ItensAFazerComponent {
  @Input() itensAFazer: IItemAFazer[] = [];
  @Input() isPendente: boolean = !true;
  @Input() servicoId!: number;
  @Input() screen!: 'ORCAMENTO' | 'MANUTENCAO';

  @Output() refresh = new EventEmitter<void>();

  @Output() itensUpdated = new EventEmitter<{
    descricao: string,
    tipoMecanico: string,
    statusManutencao: string,
    tipoManutencao: string,
    valorTotalPecas: number,
    valorMaoDeObra: number
  }>();

  public showForm: boolean = false;

  private modalService = inject(ModalService);

  // Adiciona um novo item à lista de Itens a Fazer
  async adicionarItem() {
    await this.modalService.showItensModal(true, this.servicoId, this.screen, this.itensAFazer.map(item => item.id));

    this.refresh.emit();
    return;
  }

    // Remove um item da lista
    removerItem(index: number) {
      this.itensAFazer.splice(index, 1);
      this.itensUpdated.emit(this.itensAFazer as any);  // Emite a lista atualizada
    }
  
    // Edita um item existente
    async editarItem(itemId: number) {      
      await this.modalService.showItensModal(this.isPendente, this.servicoId, this.screen,this.itensAFazer.map(item => item.id), itemId);
      this.refresh.emit();
    }
}

