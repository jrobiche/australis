import { TestBed } from '@angular/core/testing';

import { XboxunityService } from './xboxunity.service';

describe('XboxunityService', () => {
  let service: XboxunityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XboxunityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
