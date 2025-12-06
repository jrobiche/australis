import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAssetsDialogComponent } from './upload-assets-dialog.component';

describe('UploadAssetsDialogComponent', () => {
  let component: UploadAssetsDialogComponent;
  let fixture: ComponentFixture<UploadAssetsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadAssetsDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadAssetsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
