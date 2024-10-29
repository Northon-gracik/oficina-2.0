import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularioInspecaoComponent } from './servico/formulario-inspecao/formulario-inspecao.component';
import { ComponentsModule as SharedModule } from '../../../shared/components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItensAFazerComponent } from './servico/itens-a-fazer/itens-a-fazer.component';
import { ModalItemComponent } from './servico/itens-a-fazer/modal/modal-item/modal-item.component';
import { ModalIdentificarVeiculoComponent } from './modal-identificar-veiculo/modal-identificar-veiculo.component';
import { StepsModule } from 'primeng/steps';
import { StepperModule } from 'primeng/stepper';
import { CalendarModule } from 'primeng/calendar';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [FormularioInspecaoComponent, ItensAFazerComponent, ModalItemComponent, ModalIdentificarVeiculoComponent],
  imports: [
    CommonModule, SharedModule, FormsModule, ReactiveFormsModule, StepperModule, NgbTimepickerModule
  ],
  exports: [FormularioInspecaoComponent, ItensAFazerComponent]
})
export class ComponentsCompanyModule { }
