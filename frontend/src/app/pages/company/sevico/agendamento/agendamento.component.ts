import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ServicoService } from '../../../../core/services/servico.service';
import { ToasterService } from '../../../../shared/components/toaster/toaster.service';
import { LoaderService } from '../../../../shared/components/loader/loader.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'primeng/api';
import { ComponentsModule } from '../../../../shared/components/components.module';
import { IServico } from '../../../../core/models/servicosModels';
import { convertToDateJS, formatarData } from '../../../../shared/util/dateUtil';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agendamento',
  templateUrl: './agendamento.component.html',
  styleUrl: './agendamento.component.scss',
  standalone: true,
  imports:[CommonModule, ComponentsModule, FormsModule, ReactiveFormsModule, RouterModule]
})
export class AgendamentoComponent implements OnInit{
  public agendamentoForm: FormGroup;
  public dataAgendamento = new FormControl('', [Validators.required]);
  public descricaoProblema = new FormControl('', [Validators.required, Validators.minLength(10)]);
  public errorMessage: string | null = null;

  constructor(
    private toastService: ToasterService,
    private loader: LoaderService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.agendamentoForm = new FormGroup({
      dataAgendamento: this.dataAgendamento,
      descricaoProblema: this.descricaoProblema
    });
  }
  ngOnInit(): void {
    const servico = this.route.parent?.snapshot.data['servico'] as IServico
    
    if (servico && servico.agendamento) {
  
      // Garantir que agendamento existe e tem os atributos corretos
      const { agendamento } = servico;
      if (agendamento.dataAgendamento && agendamento.descricaoProblema) {
        // Definir os valores nos inputs
        this.dataAgendamento.setValue(formatarData(convertToDateJS(agendamento.dataAgendamento as any as number[])));
        this.descricaoProblema.setValue(agendamento.descricaoProblema);
  
        // Desabilitar os campos
        this.dataAgendamento.disable();
        this.descricaoProblema.disable();
      } else {
        console.error('Atributos de agendamento faltando:', agendamento);
      }
    } else {
      this.toastService.showDanger('Serviço ou agendamento não encontrados.');
      console.error('Serviço ou agendamento não encontrados.');
    }
  }

  public avancar(): void{
    this.router.navigate(['empresa/servico', this.route.parent?.snapshot.params['id'], 'inspeção-entrada']);
  }
}
