import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoleNavigationListComponent } from './console-navigation-list.component';

describe('ConsoleNavigationListComponent', () => {
  let component: ConsoleNavigationListComponent;
  let fixture: ComponentFixture<ConsoleNavigationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsoleNavigationListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsoleNavigationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
