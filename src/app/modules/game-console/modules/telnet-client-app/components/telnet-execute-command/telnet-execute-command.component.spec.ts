import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelnetExecuteCommandComponent } from './telnet-execute-command.component';

describe('TelnetExecuteCommandComponent', () => {
  let component: TelnetExecuteCommandComponent;
  let fixture: ComponentFixture<TelnetExecuteCommandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelnetExecuteCommandComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TelnetExecuteCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
