import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspecaoSaidaComponent } from './inspecao-saida.component';

describe('InspecaoSaidaComponent', () => {
  let component: InspecaoSaidaComponent;
  let fixture: ComponentFixture<InspecaoSaidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InspecaoSaidaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InspecaoSaidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
