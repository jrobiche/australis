import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAndDetailsLayoutComponent } from './list-and-details-layout.component';

describe('ListAndDetailsLayoutComponent', () => {
  let component: ListAndDetailsLayoutComponent;
  let fixture: ComponentFixture<ListAndDetailsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAndDetailsLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListAndDetailsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
