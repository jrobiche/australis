import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadGameDataDialogComponent } from './download-game-data-dialog.component';

describe('DownloadGameDataDialogComponent', () => {
  let component: DownloadGameDataDialogComponent;
  let fixture: ComponentFixture<DownloadGameDataDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadGameDataDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DownloadGameDataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
