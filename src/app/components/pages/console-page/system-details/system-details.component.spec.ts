import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemDetailsComponent } from './system-details.component';

describe('SystemDetailsComponent', () => {
  let component: SystemDetailsComponent;
  let fixture: ComponentFixture<SystemDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SystemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
