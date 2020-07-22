import { TestBed } from '@angular/core/testing';

import { ColumnSelectorService } from './column-selector.service';

describe('ColumnSelectorService', () => {
  let service: ColumnSelectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColumnSelectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
