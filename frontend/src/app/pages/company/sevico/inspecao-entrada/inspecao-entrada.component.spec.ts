import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspecaoEntradaComponent } from './inspecao-entrada.component';

describe('InspecaoEntradaComponent', () => {
  let component: InspecaoEntradaComponent;
  let fixture: ComponentFixture<InspecaoEntradaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InspecaoEntradaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InspecaoEntradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
