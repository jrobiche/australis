import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateConsoleDialogComponent } from './create-update-console-dialog.component';

describe('CreateUpdateConsoleDialogComponent', () => {
  let component: CreateUpdateConsoleDialogComponent;
  let fixture: ComponentFixture<CreateUpdateConsoleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUpdateConsoleDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUpdateConsoleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
