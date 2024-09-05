import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDetalhesComponent } from './company-detalhes.component';

describe('CompanyDetalhesComponent', () => {
  let component: CompanyDetalhesComponent;
  let fixture: ComponentFixture<CompanyDetalhesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyDetalhesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
