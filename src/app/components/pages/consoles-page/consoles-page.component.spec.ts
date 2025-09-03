import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsolesPageComponent } from './consoles-page.component';

describe('ConsolesPageComponent', () => {
  let component: ConsolesPageComponent;
  let fixture: ComponentFixture<ConsolesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsolesPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsolesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
