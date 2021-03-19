import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostWrapMygalleryComponent } from './post-wrap-mygallery.component';

describe('PostWrapMygalleryComponent', () => {
  let component: PostWrapMygalleryComponent;
  let fixture: ComponentFixture<PostWrapMygalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostWrapMygalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostWrapMygalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
