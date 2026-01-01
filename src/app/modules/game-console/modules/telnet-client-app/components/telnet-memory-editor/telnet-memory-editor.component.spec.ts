import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelnetMemoryEditorComponent } from './telnet-memory-editor.component';

describe('TelnetMemoryEditorComponent', () => {
  let component: TelnetMemoryEditorComponent;
  let fixture: ComponentFixture<TelnetMemoryEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelnetMemoryEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TelnetMemoryEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
