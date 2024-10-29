import { TestBed } from '@angular/core/testing';

import { EtapasService } from './etapas.service';

describe('EtapasService', () => {
  let service: EtapasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EtapasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
