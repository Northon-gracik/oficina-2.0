import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { ToasterService } from '../../shared/components/toaster/toaster.service';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { InputType } from '../../shared/components/custom-input/InputType.type';
import { DropdownModule } from 'primeng/dropdown';
import { IOptionSelect } from '../../shared/components/select/opitonSelect.model';

@Component({
  selector: 'app-dev',
  templateUrl: './dev.component.html',
  styleUrls: ['./dev.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule, NgbTooltipModule],
})
export class DevComponent implements OnInit {
  public control = new FormControl('');
  public controlCheckbox = new FormControl(false);

  public inputTypes: InputType[] = ['text', 'password', 'email', 'number', 'tel', 'date', 'numeroIdentificacao', 'datetime-local', 'currency'];

  toastService = inject(ToasterService);
  loader = inject(LoaderService);

  files = new FormControl(null) // Controla os arquivos de imagem carregados

  public internalControl = new FormControl();
  public controlSelect = new FormControl();
  public myOptionsSelectDefault: IOptionSelect[] = [
    { label: 'Opção int numeral', value: 1 },
    { label: 'Opção str numeral', value: 2 },
    { label: 'Opção lvl numeral', value: 3 },
    { label: 'Opção 1', value: 'value1' },
    { label: 'Opção 2', value: 'value2' },
    { label: 'Opção 3', value: 'value3' },
    { label: 'Opção 4', value: 'value4' },
    { label: 'Opção 5', value: 'value5' }
  ];
  public myOptionsSelect: IOptionSelect[] = this.myOptionsSelectDefault;

  onFilesDropped(fileList: FileList) {
    console.log('Files dropped:', fileList);
    // Lógica adicional para upload ou processamento dos arquivos
  }

  isLoading = false;
  isDeleting = false;

  onSubmit() {
    this.isLoading = true;
    // Lógica de envio
  }

  onDelete() {
    this.isDeleting = true;
    // Lógica de exclusão
  }

  showStandard() {
    this.toastService.showStandard('Mensagem padrao');
  }

  showSuccess() {
    this.toastService.showSuccess('Mensagem de confirmacao');
  }

  showDanger() {
    this.toastService.showDanger('Mensagem de erro');
  }

  showToast(type: string) {
    switch (type) {
      case 'standard':
        this.showStandard();
        break;
      case 'success':
        this.showSuccess();
        break;
      case 'danger':
        this.showDanger();
        break;
    }
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }

  showLoader(): void {
    this.loader.show();
    setTimeout(() => this.loader.hide(), 5000);
  }

  ngOnInit(): void {
    this.files.valueChanges.subscribe((value) =>
      console.log(value)
    );
    this.internalControl.valueChanges.subscribe((value) =>
      this.myOptionsSelect = this.myOptionsSelectDefault.filter(
        option => option.label.toLowerCase().includes(
          value.toLowerCase()
        )
      )
    );
    this.controlSelect.setValue(3);
  }
}

