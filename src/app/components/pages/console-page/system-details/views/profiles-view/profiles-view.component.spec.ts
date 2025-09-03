import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilesViewComponent } from './profiles-view.component';

describe('ProfilesViewComponent', () => {
  let component: ProfilesViewComponent;
  let fixture: ComponentFixture<ProfilesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilesViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
