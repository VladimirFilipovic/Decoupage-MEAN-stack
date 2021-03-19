import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostShowMygalleryComponent } from './post-show-mygallery.component';

describe('PostShowMygalleryComponent', () => {
  let component: PostShowMygalleryComponent;
  let fixture: ComponentFixture<PostShowMygalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostShowMygalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostShowMygalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
