import { Component, inject, Input } from '@angular/core';
import { FormErrorType } from '../../../../../shared/components/custom-input/form-error.enum';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoaderService } from '../../../../../shared/components/loader/loader.service';
import { ToasterService } from '../../../../../shared/components/toaster/toaster.service';
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ServicoService } from '../../../../../core/services/servico.service';
import { SharedModule } from '../../../../../shared/shared.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-agendamento',
  templateUrl: './modal-agendamento.component.html',
  styleUrl: './modal-agendamento.component.scss',
  standalone: true,
  imports: [CommonModule, SharedModule, NgbTooltipModule, ReactiveFormsModule],
})
export class ModalAgendamentoComponent {
  agendamentoForm: FormGroup;
  dataAgendamento = new FormControl('', [Validators.required]);
  descricaoProblema = new FormControl('', [Validators.required, Validators.minLength(10)]);
  errorMessage: string | null = null;

  constructor(
    public activeModal: NgbActiveModal,
    private agendamentoService: ServicoService,
    private toastService: ToasterService,
    private loader: LoaderService
  ) {
    this.agendamentoForm = new FormGroup({
      dataAgendamento: this.dataAgendamento,
      descricaoProblema: this.descricaoProblema
    })
  }


  isFormValid(): boolean {
    return !this.agendamentoForm.invalid;
  }

  async onSubmit(): Promise<void> {
    this.loader.show();
    if (this.agendamentoForm.valid) {
      const agendamento = this.agendamentoForm.value;
      await this.agendamentoService.agendarServico(agendamento).catch(
        (error) => {

          this.errorMessage = 'Ocorreu um erro ao tentar agendar o serviço.';
          this.toastService.showDanger(this.errorMessage);
        }
      );
      this.toastService.showSuccess('Serviço agendado com sucesso.');
      this.activeModal.close('Agendamento confirmado');
    }
    this.loader.hide();
  }
}
