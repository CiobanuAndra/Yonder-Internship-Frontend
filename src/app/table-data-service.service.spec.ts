import { TestBed } from '@angular/core/testing';

import { TableDataServiceService } from './table-data-service.service';

describe('TableDataServiceService', () => {
  let service: TableDataServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableDataServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
