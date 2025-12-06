import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { gameConsoleConfigurationResolver } from './game-console-configuration.resolver';

describe('gameConsoleConfigurationResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() =>
      gameConsoleConfigurationResolver(...resolverParameters),
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
