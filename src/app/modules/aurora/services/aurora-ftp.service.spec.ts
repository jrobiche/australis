import { TestBed } from '@angular/core/testing';

import { AuroraFtpService } from './aurora-ftp.service';

describe('AuroraFtpService', () => {
  let service: AuroraFtpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuroraFtpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
