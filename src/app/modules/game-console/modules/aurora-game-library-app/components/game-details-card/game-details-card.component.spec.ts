import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDetailsCardComponent } from './game-details-card.component';

describe('GameDetailsCardComponent', () => {
  let component: GameDetailsCardComponent;
  let fixture: ComponentFixture<GameDetailsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameDetailsCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameDetailsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
