import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDeleteVehicleComponent } from './modal-delete-vehicle.component';

describe('ModalDeleteVehicleComponent', () => {
  let component: ModalDeleteVehicleComponent;
  let fixture: ComponentFixture<ModalDeleteVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalDeleteVehicleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDeleteVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
