import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuroraGameLibraryAppComponent } from './aurora-game-library-app.component';

describe('AuroraGameLibraryAppComponent', () => {
  let component: AuroraGameLibraryAppComponent;
  let fixture: ComponentFixture<AuroraGameLibraryAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuroraGameLibraryAppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuroraGameLibraryAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
