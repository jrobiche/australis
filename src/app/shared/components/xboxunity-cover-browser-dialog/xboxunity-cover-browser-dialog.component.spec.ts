import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XboxunityCoverBrowserDialogComponent } from './xboxunity-cover-browser-dialog.component';

describe('XboxunityCoverBrowserDialogComponent', () => {
  let component: XboxunityCoverBrowserDialogComponent;
  let fixture: ComponentFixture<XboxunityCoverBrowserDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XboxunityCoverBrowserDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(XboxunityCoverBrowserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
