import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostArtistPageComponent } from './post-artist-page.component';

describe('PostArtistPageComponent', () => {
  let component: PostArtistPageComponent;
  let fixture: ComponentFixture<PostArtistPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostArtistPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostArtistPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
