import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { servicoEtapasGuard } from './servico-etapas.guard';

describe('servicoEtapasGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => servicoEtapasGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
