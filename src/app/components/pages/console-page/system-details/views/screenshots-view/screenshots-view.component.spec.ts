import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenshotsViewComponent } from './screenshots-view.component';

describe('ScreenshotsViewComponent', () => {
  let component: ScreenshotsViewComponent;
  let fixture: ComponentFixture<ScreenshotsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenshotsViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScreenshotsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
