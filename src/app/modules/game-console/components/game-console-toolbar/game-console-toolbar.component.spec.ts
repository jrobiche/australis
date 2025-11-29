import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameConsoleToolbarComponent } from './game-console-toolbar.component';

describe('GameConsoleToolbarComponent', () => {
  let component: GameConsoleToolbarComponent;
  let fixture: ComponentFixture<GameConsoleToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameConsoleToolbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameConsoleToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
