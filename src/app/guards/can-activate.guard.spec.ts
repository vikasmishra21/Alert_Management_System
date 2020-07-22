import { TestBed } from '@angular/core/testing';

import { CanActivateGuard } from './can-activate.guard';
import { RouterTestingModule } from '@angular/router/testing';

describe('CanActivateGuard', () => {
  let guard: CanActivateGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule]
    });
    guard = TestBed.inject(CanActivateGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
