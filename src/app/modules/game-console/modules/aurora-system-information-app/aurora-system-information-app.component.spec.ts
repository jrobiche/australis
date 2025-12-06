import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuroraSystemInformationAppComponent } from './aurora-system-information-app.component';

describe('AuroraSystemInformationAppComponent', () => {
  let component: AuroraSystemInformationAppComponent;
  let fixture: ComponentFixture<AuroraSystemInformationAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuroraSystemInformationAppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuroraSystemInformationAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
