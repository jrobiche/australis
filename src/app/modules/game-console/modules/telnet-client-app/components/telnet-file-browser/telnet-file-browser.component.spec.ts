import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelnetFileBrowserComponent } from './telnet-file-browser.component';

describe('TelnetFileBrowserComponent', () => {
  let component: TelnetFileBrowserComponent;
  let fixture: ComponentFixture<TelnetFileBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelnetFileBrowserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TelnetFileBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
