import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConsoleDialogComponent } from './delete-console-dialog.component';

describe('DeleteConsoleDialogComponent', () => {
  let component: DeleteConsoleDialogComponent;
  let fixture: ComponentFixture<DeleteConsoleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteConsoleDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteConsoleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
