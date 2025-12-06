import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuroraAssetManagerAppComponent } from './aurora-asset-manager-app.component';

describe('AuroraAssetManagerAppComponent', () => {
  let component: AuroraAssetManagerAppComponent;
  let fixture: ComponentFixture<AuroraAssetManagerAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuroraAssetManagerAppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuroraAssetManagerAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
