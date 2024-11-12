import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FormErrorType } from './form-error.enum';
import { FormErrorMessages } from './form-error-messages';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { generateRandomId } from '../../util/stringUtil';
import { InputType } from './InputType.type';


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
  public isRequired = false;

  ngOnInit() {
    this.isRequired = this.control.hasValidator(Validators.required);    

    if (this.type === 'tel') {
      this.mask = '(00) 0000-0000||(00) 00000-0000';
      // this.control.addValidators(Validators.pattern(/^\(?[1-9]{2}\)?[-. ]?[1-9]\d{3}[-. ]?\d{4}$/));
    } else if (this.type === 'numeroIdentificacao') {
      this.mask = '000.000.000-00||00.000.000/0000-00';
    } else if (this.type === 'cep') {
      this.mask = '00000-000';
      // this.control.addValidators(Validators.pattern(/^\d{2}.\d{3}-\d{3}$/));
    }
    this.inputId = generateRandomId();

    setTimeout(() => {
      (document.activeElement as HTMLElement)?.blur();
      this.control.markAsUntouched();
    }, 0);
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

    console.log(this.control.errors);
    

    return errors;
  }

}
