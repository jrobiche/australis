import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameBoxartSceneComponent } from './game-boxart-scene.component';

describe('GameBoxartSceneComponent', () => {
  let component: GameBoxartSceneComponent;
  let fixture: ComponentFixture<GameBoxartSceneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameBoxartSceneComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameBoxartSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
