import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDetailsSectionComponent } from './game-details-section.component';

describe('GameDetailsSectionComponent', () => {
  let component: GameDetailsSectionComponent;
  let fixture: ComponentFixture<GameDetailsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameDetailsSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameDetailsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
