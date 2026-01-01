import { TestBed } from '@angular/core/testing';

import { TelnetService } from './telnet.service';

describe('TelnetService', () => {
  let service: TelnetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TelnetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
