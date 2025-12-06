import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAssetCardComponent } from './edit-asset-card.component';

describe('EditAssetCardComponent', () => {
  let component: EditAssetCardComponent;
  let fixture: ComponentFixture<EditAssetCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAssetCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditAssetCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
