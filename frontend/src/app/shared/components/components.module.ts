import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { CustomInputComponent } from './custom-input/custom-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToasterComponent } from './toaster/toaster.component';
import { NgbDropdownModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderComponent } from './loader/loader.component';
import { ModalCriaEmpresaComponent } from './modals/modal-cria-empresa/modal-cria-empresa.component';
import { HeaderComponent } from './core-components/header/header.component';
import { FooterComponent } from './core-components/footer/footer.component';
import { NgxMaskDirective, NgxMaskPipe, provideEnvironmentNgxMask, provideNgxMask } from 'ngx-mask';

@NgModule({
  declarations: [
    CustomInputComponent,
    ToasterComponent,
    LoaderComponent,
    ModalCriaEmpresaComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbToastModule,
    NgTemplateOutlet,
    NgbDropdownModule,
    NgxMaskDirective, NgxMaskPipe
  ],
  exports: [
    CustomInputComponent,
    ToasterComponent,
    LoaderComponent,
    ModalCriaEmpresaComponent,
    HeaderComponent,
    FooterComponent,
  ],
  providers: [
  ],
})
export class ComponentsModule {}
