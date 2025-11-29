import { TestBed } from '@angular/core/testing';

import { AuroraStateService } from './aurora-state.service';

describe('AuroraStateService', () => {
  let service: AuroraStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuroraStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
