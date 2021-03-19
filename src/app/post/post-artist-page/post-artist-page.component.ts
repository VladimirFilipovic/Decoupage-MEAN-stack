import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ViewChildren,
  QueryList
} from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Post } from "../post.model";
import { Subscription } from "rxjs";
import { PostService } from "../posts.service";
import { AuthService } from "src/app/auth/auth.service";
import { Router } from '@angular/router';
import { PostArtistCreateComponent } from '../post-artist-create/post-artist-create.component';

@Component({
  selector: 'app-post-artist-page',
  templateUrl: './post-artist-page.component.html',
  styleUrls: ['./post-artist-page.component.css']
})
export class PostArtistPageComponent implements OnInit,OnDestroy {
  postsSub: Subscription;
  userId: string;
  postsList: Post[];
  creatorId: string;
  userIsAuthenticated: boolean;
  authStatusSub: Subscription;
  @ViewChildren(PostArtistCreateComponent) postCreate !: QueryList<PostArtistCreateComponent>;
  formComment: FormGroup;
  userIsAdmin: any;


  constructor(
    public postsService: PostService,
    private router: Router,
    private authService: AuthService
  ) { this.formComment = new FormGroup({
    comment: new FormControl(null, {
    validators: [Validators.required, Validators.minLength(5)]
    }),
  }); }

  ngOnInit() {
    this.postsService.getPosts();
    this.userId = this.authService.getUserId();
    this.userIsAdmin = this.authService.userIsAdmin();

    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.postsList = posts;
        this.creatorId = this.postsService.getCreatorId();
        this.postsList = this.filterPosts(this.postsList);
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userIsAdmin = this.authService.userIsAdmin();
        this.userId = this.authService.getUserId();
      });
  }

  filterPosts(posts: Post[]) {
    const filteredPosts: Post[] = [];
    for (var post in posts) {
      if (this.creatorId === posts[post].creator) {
        filteredPosts.push(posts[post]);
      }
    }
    this.postCreate.forEach(postInstance => postInstance.setArtistName(this.creatorId));

    return filteredPosts;
  }

  
  likeBlog(id:string) {
    // Service to like a blog post
    this.postsService.likePost(id);
  }

// Function to disliked a blog post
  dislikeBlog(id:string) {
    this.postsService.dislikePost(id);
  }
  onDelete(postId: string) {
    if (this.userIsAdmin) {
      this.postsService.deletePostAdmin(postId);
    } else {
      this.postsService.deletePost(postId);
    }
  }

  commentBlog(id:string) {
    if (this.formComment.invalid) {

      alert("Invalid input");
      return;


    }
    this.postsService.postComment(id,this.formComment.value.comment);

    this.formComment.reset();
  }



  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
