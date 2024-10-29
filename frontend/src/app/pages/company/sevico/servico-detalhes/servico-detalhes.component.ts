import { Component } from '@angular/core';
import { IServico } from '../../../../core/models/servicosModels';
import { ServicoService } from '../../../../core/services/servico.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModule, NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { StepperModule, Stepper, } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { StepsModule } from 'primeng/steps';

import { MenuItem } from 'primeng/api';
import { ToasterService } from '../../../../shared/components/toaster/toaster.service';
import { EtapaService } from '../../../../core/services/etapas.service';

@Component({
  selector: 'app-servico-detalhes',
  templateUrl: './servico-detalhes.component.html',
  styleUrl: './servico-detalhes.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StepsModule,
    RouterModule
  ],
})
export class ServicoDetalhesComponent {
  servico!: IServico;

  constructor(
    private servicoService: ServicoService,
    private route: ActivatedRoute,
    private toaster: ToasterService,
    private etapaService: EtapaService
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.servico = data['servico']; // O resolver popula essa propriedade     
      this.items = [
        {
          label: 'Agendamento',
          routerLink: 'agendamento',
        },
        {
          label: 'Inspeção de Entrada',
          routerLink: 'inspeção-entrada'
        },
        {
          label: 'Orçamento',
          routerLink: 'orçamento',
          disabled: !EtapaService.isOrcamentoConcluida(this.servico),
        },
        {
          label: 'Manutenção',
          routerLink: 'manutenção',
          disabled: !EtapaService.isManutencaoConcluida(this.servico),
        },
        {
          label: 'Inspeção de Saída',
          routerLink: 'inspeção-saída',
          disabled: !EtapaService.isInspecaoSaidaConcluida(this.servico),
        },
        {
          label: 'Entrega',
          routerLink: 'entrega',
          disabled: !EtapaService.isEntregaConcluida(this.servico),
        }
      ] 
    });



  }

  getSteps(): string[] {
    return [
      'Agendamento',
      'Inspeção de Entrada',
      'Orçamento',
      'Manutenção',
      'Inspeção de Saída',
      'Entrega'
    ];
  }

  public items: MenuItem[] = []
}
