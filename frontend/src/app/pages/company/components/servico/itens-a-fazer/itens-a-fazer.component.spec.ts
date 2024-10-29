import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItensAFazerComponent } from './itens-a-fazer.component';

describe('ItensAFazerComponent', () => {
  let component: ItensAFazerComponent;
  let fixture: ComponentFixture<ItensAFazerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItensAFazerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItensAFazerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
