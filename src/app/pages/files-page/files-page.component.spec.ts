import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesPageComponent } from './files-page.component';

describe('FilesPageComponent', () => {
  let component: FilesPageComponent;
  let fixture: ComponentFixture<FilesPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilesPageComponent]
    });
    fixture = TestBed.createComponent(FilesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
