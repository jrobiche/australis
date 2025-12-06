import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovaPluginViewComponent } from './nova-plugin-view.component';

describe('NovaPluginViewComponent', () => {
  let component: NovaPluginViewComponent;
  let fixture: ComponentFixture<NovaPluginViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovaPluginViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NovaPluginViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
