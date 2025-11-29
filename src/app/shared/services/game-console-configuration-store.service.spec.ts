import { TestBed } from '@angular/core/testing';

import { GameConsoleConfigurationStoreService } from './game-console-configuration-store.service';

describe('GameConsoleConfigurationStoreService', () => {
  let service: GameConsoleConfigurationStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameConsoleConfigurationStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
