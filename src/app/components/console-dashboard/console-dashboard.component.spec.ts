import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoleDashboardComponent } from './console-dashboard.component';

describe('ConsoleDashboardComponent', () => {
  let component: ConsoleDashboardComponent;
  let fixture: ComponentFixture<ConsoleDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsoleDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsoleDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
