import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioInspecaoComponent } from './formulario-inspecao.component';

describe('FormularioInspecaoComponent', () => {
  let component: FormularioInspecaoComponent;
  let fixture: ComponentFixture<FormularioInspecaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormularioInspecaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioInspecaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
