import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss'
})
export class CheckboxComponent {
  // FormControl para controlar o valor do checkbox
  @Input() control!: FormControl;
  @Input() label: string = '';
  @Input() disabled: boolean = false;

  // Getter para verificar se o checkbox está marcado
  get isChecked(): boolean {
    return this.control.value;
  }

  // Atualiza o valor do FormControl ao alterar o checkbox
  onCheckboxChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.control.setValue(inputElement.checked);
  }
}
