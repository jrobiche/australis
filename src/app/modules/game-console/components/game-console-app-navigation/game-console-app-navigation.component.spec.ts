import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameConsoleAppNavigationComponent } from './game-console-app-navigation.component';

describe('GameConsoleAppNavigationComponent', () => {
  let component: GameConsoleAppNavigationComponent;
  let fixture: ComponentFixture<GameConsoleAppNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameConsoleAppNavigationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameConsoleAppNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
