import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { CustomInputComponent } from './custom-input/custom-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToasterComponent } from './toaster/toaster.component';
import { NgbDropdown, NgbDropdownModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderComponent } from './loader/loader.component';
import { ModalCriaEmpresaComponent } from './modals/modal-cria-empresa/modal-cria-empresa.component';
import { HeaderComponent } from './core-components/header/header.component';
import { FooterComponent } from './core-components/footer/footer.component';
import { NgxMaskDirective, NgxMaskPipe, provideEnvironmentNgxMask, provideNgxMask } from 'ngx-mask';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { ButtonComponent } from './button/button.component';
import { DropzoneComponent } from './dropzone/dropzone.component';
import { SelectComponent } from './select/select.component';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [
    CustomInputComponent,
    ToasterComponent,
    LoaderComponent,
    ModalCriaEmpresaComponent,
    HeaderComponent,
    FooterComponent,
    CheckboxComponent,
    ButtonComponent,
    DropzoneComponent,
    SelectComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbToastModule,
    NgTemplateOutlet,
    NgbDropdownModule,
    NgxMaskDirective, 
    NgxMaskPipe,
    DropdownModule, 
    NgbDropdownModule

  ],
  exports: [
    CustomInputComponent,
    ToasterComponent,
    LoaderComponent,
    ModalCriaEmpresaComponent,
    HeaderComponent,
    FooterComponent,
    CheckboxComponent,
    ButtonComponent,
    DropzoneComponent,
    SelectComponent,
  ],
  providers: [
  ],
})
export class ComponentsModule {}
