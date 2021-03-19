import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  QueryList,
  ViewChildren
} from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Post } from "../post.model";
import { Subscription } from "rxjs";
import { PostService } from "../posts.service";
import { AuthService } from "src/app/auth/auth.service";
import { PostCreateComponent } from '../post-create/post-create.component';
import { mimeType } from '../post-create/type.validator';

@Component({
  selector: "app-post-show-mygallery",
  templateUrl: "./post-show-mygallery.component.html",
  styleUrls: ["./post-show-mygallery.component.css"]
})
export class PostShowMygalleryComponent implements OnInit, OnDestroy,AfterViewInit {

  @ViewChild("title", { static: false }) inputNameRef: ElementRef;
  @ViewChild("text", { static: false }) inputTextRef: ElementRef;
  @ViewChild("closeAddExpenseModal", { static: false }) closeAddExpenseModal: ElementRef;
  @ViewChildren(PostCreateComponent) postCreate !: QueryList<PostCreateComponent>;




  form: FormGroup;
  imagePreview: string;
  imagePicked: File;
  postId: string;
  postsList: Post[] = [];
  post: Post;
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  public userIsAuthenticated = false;
  userId: string;
  formComment: FormGroup;

  constructor(
    public postsService: PostService,
    private authService: AuthService
  ) {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required,Validators.minLength(5), Validators.pattern('^[a-zA-Z ]*$')]
      }),
      text: new FormControl(null, { validators: [Validators.required,Validators.minLength(5), Validators.pattern('^[a-zA-Z ]*$')] }),
      image: new FormControl(null, {validators: [Validators.required]})
    });

    this.formComment = new FormGroup({
      comment: new FormControl(null, {
      validators: [Validators.required, Validators.minLength(5)]
      }),
    });
  }

  ngOnInit() {
    this.postsService.getPosts();
    this.userId = this.authService.getUserId();

    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.postsList = this.filterPosts(posts);


      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();

      });
  }

  filterPosts(posts: Post[]) {
    const filteredPosts: Post[] = [];
    for (var post in posts) {
      if (this.userId === posts[post].creator) {
        filteredPosts.push(posts[post]);
      }
     
    }
    this.postCreate.forEach(postInstance => postInstance.setArtistName(this.authService.getUserName()));


    return filteredPosts;
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }



  onUpdate(postId: string, postTitle: string, postText: string) {
    this.post = this.postsService.getPost(postId);
    this.form.setValue({
      title: postTitle,
      text: postText,
      image: this.post.imagePath

    });
    this.imagePreview = this.post.imagePath;
    
    this.postId = postId;
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    //ovo informise angular da je promenjena vrednosti i daje proveri
    this.form.get("image").updateValueAndValidity();
    console.log(file);
    console.log(this.form);
    const reader = new FileReader();
    //when hes done loading the image he will call funcition
    reader.onload = () => {
      this.imagePreview = reader.result.toString();
      this.imagePicked = file;
    };
    reader.readAsDataURL(file);
  }
  updateModal() {
    if(this.form.invalid){
      alert('Invalid input');
      return;
    }

    if(!this.imagePicked){
      alert('You have to add a picture');
      return;
    }

    this.postsService.updatePost(
      this.postId,
      this.form.value.title,
      this.form.value.text,
      this.imagePicked
    );
    this.closeAddExpenseModal.nativeElement.click();

    this.form.reset();
  }

  ngAfterViewInit(): void {
    this.postCreate.forEach(postInstance => postInstance.setArtistName(this.authService.getUserName()));

  }
  likeBlog(id:string) {
    // Service to like a blog post
    this.postsService.likePost(id);
  }

// Function to disliked a blog post
  dislikeBlog(id:string) {
    this.postsService.dislikePost(id);
  }

  commentBlog(id:string) {
    if (this.formComment.invalid) {

      alert("Invalid input");
      return;


    }
    this.postsService.postComment(id,this.formComment.value.comment);

    this.formComment.reset();
  }

  personalGallery(creatorId:string){
    this.postsService.personalGallery(creatorId);
  }


  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
