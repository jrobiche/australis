import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageTitleToolbarComponent } from './page-title-toolbar.component';

describe('PageTitleToolbarComponent', () => {
  let component: PageTitleToolbarComponent;
  let fixture: ComponentFixture<PageTitleToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageTitleToolbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageTitleToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
