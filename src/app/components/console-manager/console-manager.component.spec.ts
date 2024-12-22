import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoleManagerComponent } from './console-manager.component';

describe('ConsoleManagerComponent', () => {
  let component: ConsoleManagerComponent;
  let fixture: ComponentFixture<ConsoleManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsoleManagerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsoleManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
