import { TestBed } from '@angular/core/testing';

import { AuroraHttpService } from './aurora-http.service';

describe('AuroraHttpService', () => {
  let service: AuroraHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuroraHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
