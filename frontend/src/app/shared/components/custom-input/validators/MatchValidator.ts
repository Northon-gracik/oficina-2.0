import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function MatchValidator(controlToCompare: FormControl): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
        if (controlToCompare && controlToCompare.value !== control.value) {
      return { 'mismatch': true };
    }
    return null;
  };
}
