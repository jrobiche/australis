import { TestBed } from '@angular/core/testing';

import { AuroraGameService } from './aurora-game.service';

describe('AuroraGameService', () => {
  let service: AuroraGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuroraGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
