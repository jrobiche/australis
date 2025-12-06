import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameConsoleAppNavigationListComponent } from './game-console-app-navigation-list.component';

describe('GameConsoleAppNavigationListComponent', () => {
  let component: GameConsoleAppNavigationListComponent;
  let fixture: ComponentFixture<GameConsoleAppNavigationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameConsoleAppNavigationListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameConsoleAppNavigationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
