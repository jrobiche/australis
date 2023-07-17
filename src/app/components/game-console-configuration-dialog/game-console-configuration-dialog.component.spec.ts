import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameConsoleConfigurationDialogComponent } from './game-console-configuration-dialog.component';

describe('GameConsoleConfigurationDialogComponent', () => {
  let component: GameConsoleConfigurationDialogComponent;
  let fixture: ComponentFixture<GameConsoleConfigurationDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameConsoleConfigurationDialogComponent]
    });
    fixture = TestBed.createComponent(GameConsoleConfigurationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
