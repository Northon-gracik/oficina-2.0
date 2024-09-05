import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetalhesComponent } from './user-detalhes.component';

describe('UserDetalhesComponent', () => {
  let component: UserDetalhesComponent;
  let fixture: ComponentFixture<UserDetalhesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserDetalhesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
