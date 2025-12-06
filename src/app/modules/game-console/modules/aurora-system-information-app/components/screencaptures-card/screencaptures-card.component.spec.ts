import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreencapturesCardComponent } from './screencaptures-card.component';

describe('ScreencapturesCardComponent', () => {
  let component: ScreencapturesCardComponent;
  let fixture: ComponentFixture<ScreencapturesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreencapturesCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScreencapturesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
