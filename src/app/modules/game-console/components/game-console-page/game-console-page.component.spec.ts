import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameConsolePageComponent } from './game-console-page.component';

describe('GameConsolePageComponent', () => {
  let component: GameConsolePageComponent;
  let fixture: ComponentFixture<GameConsolePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameConsolePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameConsolePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
