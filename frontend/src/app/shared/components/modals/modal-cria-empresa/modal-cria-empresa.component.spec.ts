import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCriaEmpresaComponent } from './modal-cria-empresa.component';

describe('ModalCriaEmpresaComponent', () => {
  let component: ModalCriaEmpresaComponent;
  let fixture: ComponentFixture<ModalCriaEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalCriaEmpresaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCriaEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
