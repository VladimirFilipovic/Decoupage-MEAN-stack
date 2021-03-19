import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostArtistCreateComponent } from './post-artist-create.component';

describe('PostArtistCreateComponent', () => {
  let component: PostArtistCreateComponent;
  let fixture: ComponentFixture<PostArtistCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostArtistCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostArtistCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
