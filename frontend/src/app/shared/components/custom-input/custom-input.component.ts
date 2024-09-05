import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormErrorType } from './form-error.enum';
import { FormErrorMessages } from './form-error-messages';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrl: './custom-input.component.scss'
})
export class CustomInputComponent {
  @Input() control!: FormControl;
  @Input() label!: string;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() inputId: string = '';

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
}
