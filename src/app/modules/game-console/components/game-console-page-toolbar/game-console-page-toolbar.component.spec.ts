import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameConsolePageToolbarComponent } from './game-console-page-toolbar.component';

describe('GameConsolePageToolbarComponent', () => {
  let component: GameConsolePageToolbarComponent;
  let fixture: ComponentFixture<GameConsolePageToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameConsolePageToolbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameConsolePageToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
