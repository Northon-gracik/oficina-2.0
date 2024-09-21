import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CpfCnpjPipe } from './cpfCnpj.pipe';
import { numeroTelefonePipe } from './numeroTelefone.pipe';



@NgModule({
  declarations: [CpfCnpjPipe, numeroTelefonePipe],
  imports: [
    CommonModule
  ],
  exports: [CpfCnpjPipe, numeroTelefonePipe]
})
export class PipesModule { }
