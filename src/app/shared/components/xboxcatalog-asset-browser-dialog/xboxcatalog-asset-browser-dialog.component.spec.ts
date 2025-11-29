import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XboxcatalogAssetBrowserDialogComponent } from './xboxcatalog-asset-browser-dialog.component';

describe('XboxcatalogAssetBrowserDialogComponent', () => {
  let component: XboxcatalogAssetBrowserDialogComponent;
  let fixture: ComponentFixture<XboxcatalogAssetBrowserDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XboxcatalogAssetBrowserDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(XboxcatalogAssetBrowserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
