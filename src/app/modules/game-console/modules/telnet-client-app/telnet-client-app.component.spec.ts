import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelnetClientAppComponent } from './telnet-client-app.component';

describe('TelnetClientAppComponent', () => {
  let component: TelnetClientAppComponent;
  let fixture: ComponentFixture<TelnetClientAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelnetClientAppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TelnetClientAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
