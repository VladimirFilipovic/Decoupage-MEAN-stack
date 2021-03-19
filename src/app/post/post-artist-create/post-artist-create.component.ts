import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PostService } from '../posts.service';

@Component({
  selector: 'app-post-artist-create',
  templateUrl: './post-artist-create.component.html',
  styleUrls: ['./post-artist-create.component.css']
})
export class PostArtistCreateComponent implements OnInit {
  @ViewChild('artistName' ,{static: false}) artistName: ElementRef;
  artist: string;
  constructor(public postsService: PostService) {}

  ngOnInit() {
  }

  setArtistName(artistName:string){
    this.artist=artistName;
  }
}
