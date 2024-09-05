import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomInputComponent } from "../../shared/components/custom-input/custom-input.component";
import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../../shared/components/components.module';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SharedModule,],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  name = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(8)]);

  cpf = new FormControl('', [Validators.required]);

  submitted = false;

  // constructor(private http: HttpClient) {}
  constructor() {}

  onSubmit(event: Event) {
    event.preventDefault()
    // if (this.name.invalid || this.email.invalid || this.password.invalid) {
    //   return;
    // }

    const userData = {
      name: this.name.value,
      email: this.email.value,
      password: this.password.value
    };

    console.log({userData});
  }
}
