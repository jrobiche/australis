import { TestBed } from '@angular/core/testing';

import { GameConsoleConfigurationService } from './game-console-configuration.service';

describe('GameConsoleConfigurationService', () => {
  let service: GameConsoleConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameConsoleConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
