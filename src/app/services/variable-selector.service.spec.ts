import { TestBed } from '@angular/core/testing';

import { VariableSelectorService } from './variable-selector.service';

describe('VariableSelectorService', () => {
  let service: VariableSelectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VariableSelectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
