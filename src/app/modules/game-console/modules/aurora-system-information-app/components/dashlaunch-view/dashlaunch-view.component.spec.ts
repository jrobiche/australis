import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashlaunchViewComponent } from './dashlaunch-view.component';

describe('DashlaunchViewComponent', () => {
  let component: DashlaunchViewComponent;
  let fixture: ComponentFixture<DashlaunchViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashlaunchViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashlaunchViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
