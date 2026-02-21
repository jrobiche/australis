import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsiveWidthContainerComponent } from './responsive-width-container.component';

describe('ResponsiveWidthContainerComponent', () => {
  let component: ResponsiveWidthContainerComponent;
  let fixture: ComponentFixture<ResponsiveWidthContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponsiveWidthContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResponsiveWidthContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
