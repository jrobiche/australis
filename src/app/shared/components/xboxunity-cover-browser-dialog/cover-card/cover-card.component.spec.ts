import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverCardComponent } from './cover-card.component';

describe('CoverCardComponent', () => {
  let component: CoverCardComponent;
  let fixture: ComponentFixture<CoverCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoverCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoverCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
