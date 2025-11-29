import { TestBed } from '@angular/core/testing';

import { XboxcatalogService } from './xboxcatalog.service';

describe('XboxcatalogService', () => {
  let service: XboxcatalogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XboxcatalogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
