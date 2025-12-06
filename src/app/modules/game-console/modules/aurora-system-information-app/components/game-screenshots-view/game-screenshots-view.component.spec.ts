import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameScreenshotsViewComponent } from './game-screenshots-view.component';

describe('GameScreenshotsViewComponent', () => {
  let component: GameScreenshotsViewComponent;
  let fixture: ComponentFixture<GameScreenshotsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameScreenshotsViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameScreenshotsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
