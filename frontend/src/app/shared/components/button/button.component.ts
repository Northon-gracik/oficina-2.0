import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() label: string = 'Button'; // Label do botão
  @Input() type: 'primary' | 'secondary' | 'success' | 'danger' = 'primary'; // Tipos de estilo
  @Input() disabled: boolean = false; // Estado de desabilitação
  @Input() loading: boolean = false; // Estado de carregamento

  @Output() clicked = new EventEmitter<void>(); // Emite evento ao clicar

  // Função chamada ao clicar no botão
  onClick() {
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }
}
