import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormErrorType } from './form-error.enum';
import { FormErrorMessages } from './form-error-messages';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

type InputType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'date' | 'numeroIdentificacao';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrl: './custom-input.component.scss',
  providers: [provideNgxMask()]
})
export class CustomInputComponent implements OnInit {
  @Input() control!: FormControl;
  @Input() label!: string;
  @Input() type: InputType = 'text';
  @Input() placeholder: string = '';
  @Input() mask: string = '';

  public inputId: string = '';

  ngOnInit() {
    if (this.type === 'tel') {
      this.mask = '(00) 00000-0000';
    } else if (this.type === 'numeroIdentificacao') {
      this.mask = '000.000.000-00||00.000.000/0000-00';
    }
    this.inputId = this.generateRandomId();
  }

  getErrors(): string[] {
    const errors: string[] = [];
    if (this.control.errors) {
      for (const error in this.control.errors) {
        if (this.control.errors.hasOwnProperty(error)) {
          const errorType = error as FormErrorType;
          const getMessage = FormErrorMessages[errorType];
          if (getMessage) {
            errors.push(getMessage(this.control.errors[error]));
          }
        }
      }
    }
    return errors;
  }

  private generateRandomId(): string {
    return 'input_' + Math.random().toString(36).substr(2, 9);
  }
}
