import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadsViewComponent } from './threads-view.component';

describe('ThreadsViewComponent', () => {
  let component: ThreadsViewComponent;
  let fixture: ComponentFixture<ThreadsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreadsViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ThreadsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
