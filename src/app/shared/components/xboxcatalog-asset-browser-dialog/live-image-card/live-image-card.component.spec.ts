import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveImageCardComponent } from './live-image-card.component';

describe('LiveImageCardComponent', () => {
  let component: LiveImageCardComponent;
  let fixture: ComponentFixture<LiveImageCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveImageCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiveImageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
