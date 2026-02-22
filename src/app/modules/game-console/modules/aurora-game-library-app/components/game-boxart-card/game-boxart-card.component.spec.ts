import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameBoxartCardComponent } from './game-boxart-card.component';

describe('GameBoxartCardComponent', () => {
  let component: GameBoxartCardComponent;
  let fixture: ComponentFixture<GameBoxartCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameBoxartCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameBoxartCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
