import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  ViewChild,
  ElementRef
} from "@angular/core";
import { Post } from "../post.model";
import { PostService } from "../posts.service";
import { Subscription } from "rxjs";
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  @ViewChild("title", { static: false }) inputNameRef: ElementRef;
  @ViewChild("text", { static: false }) inputTextRef: ElementRef;
  @ViewChild("closeAddExpenseModal", { static: false })
  closeAddExpenseModal: ElementRef;
  form: FormGroup;
  formComment: FormGroup

  imagePreview: string;
  imagePicked: File;
  postId: string;
  postsList: Post[] = [];
  post: Post;
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  public userIsAuthenticated = false;
  public userIsAdmin = false;
  userId: string;

  constructor(
    public postsService: PostService,
    private authService: AuthService
  ) {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required]
      }),
      text: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required] })
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
        this.postsList = posts;

      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userIsAdmin = this.authService.userIsAdmin();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
        this.userIsAdmin = this.authService.userIsAdmin();
      });
  }

  onDelete(postId: string) {
    if (this.userIsAdmin) {
      this.postsService.deletePostAdmin(postId);
    } else {
      this.postsService.deletePost(postId);
    }
  }

  onUpdate(postId: string, postTitle: string, postText: string) {
    this.post = this.postsService.getPost(postId);
    this.form.setValue({
      title: postTitle,
      text: postText,
      image: this.post.imagePath
    });
    this.imagePreview = this.post.imagePath;
    this.imagePicked = this.post.img;
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
    if (this.userIsAdmin) {
      this.postsService.updatePostAdmin(
        this.postId,
        this.form.value.title,
        this.form.value.text,
        this.imagePicked
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.text,
        this.imagePicked
      );
    }
    this.closeAddExpenseModal.nativeElement.click();

    this.form.reset();
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

   // Expand the list of comments


  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
