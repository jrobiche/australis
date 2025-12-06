import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameAchievementsViewComponent } from './game-achievements-view.component';

describe('GameAchievementsViewComponent', () => {
  let component: GameAchievementsViewComponent;
  let fixture: ComponentFixture<GameAchievementsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameAchievementsViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameAchievementsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
