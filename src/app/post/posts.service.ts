import { Post } from "./post.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import {Comment} from './comment.model';
import { ComponentRef } from '@angular/core';
import { Router } from "@angular/router";


export class PostService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  private comment: Comment = {comment:'', commentator:''};
  private emptyComment: Comment = {comment:'', commentator:''};
  private comments: Comment[] = [this.comment];
  private creatorId:string;

  constructor(private http: HttpClient,private router: Router) {}
  // obrati paznju na ovo
  getPosts() {
    this.http
      .get<{ message: string; posts: any }>("http://localhost:3000/api/posts")
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            this.comments=[];
            console.log('u getu sam' + this.comments);
            console.log('lengts'+post.comments.length);
            for (let index = 0; index < post.comments.length; index++) {
              this.comment={comment:post.comments[index],commentator:post.commentators[index]};
              this.comments.push(this.comment);
            }

            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              img: post.img,
              creator: post.creator,
              likes: post.likes,
              dislikes: post.dislikes,
              comments: this.comments
            };
          });
        })
      )
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getCreatorId() {
    return localStorage.getItem('creatorId');
  }

  personalGallery(creatorId: string) {
    localStorage.removeItem('creatorId');
    
    localStorage.setItem('creatorId', creatorId);
    
    this.router.navigate(['/artistGallery']);
  }

  getPost(id: string) {
    return { ...this.posts.find(p => p.id === id) };
  }

  updatePost(id: string, title: string, content: string, image: File) {
    const postData = new FormData();
    const Index = this.posts.findIndex(p => p.id === id);
    const oldPost: Post = this.posts[Index];
    const likes = oldPost.likes;
    const dislikes = oldPost.dislikes;
    postData.append("id", id);
    postData.append("title", title);
    postData.append("content", content);
    postData.append("likes", String(likes));
    postData.append("dislikes", String(dislikes));
    postData.append("image", image, title);
    this.http
      .put<{ message: string }>(
        "http://localhost:3000/api/posts/" + id,
        postData
      )
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id: id,
          title: title,
          content: content,
          imagePath: response.message.toString(),
          creator: oldPost.creator,
          likes: likes,
          dislikes: dislikes,
          img: image,
          comments: oldPost.comments
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        console.log("Update uspeo" + updatedPosts[oldPostIndex].content);

        this.postsUpdated.next([...this.posts]);
      });
  }
  //subscribed to get response

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();

    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http
      .post<{ message: string; post: Post }>(
        "http://localhost:3000/api/posts",
        postData
      )
      .subscribe(responseData => {
        //ovde nije null full je skroz
        const post: Post = {
          id: responseData.post.id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath,
          img: image,
          creator: responseData.post.creator,
          likes: responseData.post.likes,
          dislikes: responseData.post.dislikes,
          comments: this.comments
        };
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(postId: string) {
    this.http
      .delete("http://localhost:3000/api/posts/" + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  updatePostAdmin(id: string, title: string, content: string, image: File) {
    let postData: Post | FormData;

    postData = new FormData();
    const Index = this.posts.findIndex(p => p.id === id);
    const oldPost: Post = this.posts[Index];
    const likes = oldPost.likes;
    const dislikes = oldPost.dislikes;
    postData.append("likes", String(likes));
    postData.append("dislikes", String(dislikes));
    postData.append("id", id);
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    this.http
      .put<{ message: string }>(
        "http://localhost:3000/api/posts/admin/" + id,
        postData
      )
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);

        const post: Post = {
          id: id,
          title: title,
          content: content,
          imagePath: response.message.toString(),
          creator: oldPost.creator,
          likes: likes,
          dislikes: dislikes,
          img: image,
          comments: oldPost.comments
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePostAdmin(postId: string) {
    this.http
      .delete("http://localhost:3000/api/posts/admin/" + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  likePost(id: string) {
    const postData = new FormData();
    const Index = this.posts.findIndex(p => p.id === id);
    const postOld: Post = this.posts[Index];
    const likes = postOld.likes;
    const dislikes = postOld.dislikes;
    postData.append("id", id);
    postData.append("title", postOld.title);
    postData.append("content", postOld.content);
    postData.append("likes", String(likes));
    postData.append("dislikes", String(dislikes));
    postData.append("imagePath", postOld.imagePath);

    this.http
      .put<{ message: string; post: any }>(
        "http://localhost:3000/api/posts/like/" + id,
        postData
      )
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        console.log("u likovanjy likova i titl " + postOld.likes + postOld.title);
        alert(response.message);
        const post: Post = {
          id: postOld.id,
          title: postOld.title,
          content: postOld.content,
          imagePath: postOld.imagePath,
          creator: postOld.creator,
          likes: response.post.likes,
          dislikes: response.post.dislikes,
          img: postOld.img,
          comments: postOld.comments,
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  // Function to dislike a blog post
  dislikePost(id: string) {
    const postData = new FormData();
    const Index = this.posts.findIndex(p => p.id === id);
    const postOld: Post = this.posts[Index];
    const likes = postOld.likes;
    const dislikes = postOld.dislikes;
    postData.append("id", id);
    postData.append("title", postOld.title);
    postData.append("content", postOld.content);
    postData.append("likes", String(likes));
    postData.append("dislikes", String(dislikes));
    postData.append("imagePath", postOld.imagePath);

    this.http
      .put<{ message: string; post: any }>(
        "http://localhost:3000/api/posts/dislike/" + id,
        postData
      )
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        alert(response.message);

        const post: Post = {
          id: postOld.id,
          title: postOld.title,
          content: postOld.content,
          imagePath: postOld.imagePath,
          creator: postOld.creator,
          likes: response.post.likes,
          dislikes: response.post.dislikes,
          img: postOld.img,
          comments: postOld.comments,
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  postComment(id: string, comment: string) {
    const postData = new FormData();
    const Index = this.posts.findIndex(p => p.id === id);
    const postOld: Post = this.posts[Index];
    const likes = postOld.likes;
    const dislikes = postOld.dislikes;

    postData.append("id", id);
    postData.append("title", postOld.title);
    postData.append("content", postOld.content);
    postData.append("likes", String(likes));
    postData.append("dislikes", String(dislikes));
    postData.append("imagePath", postOld.imagePath);
    postData.append("comment", comment);

    console.log(postData.get("comment") + "je komentar ");
    console.log("ovo je pred put u comment");
    this.http
      .post<{ message: string; post: any; commenter: string }>(
        "http://localhost:3000/api/posts/comment/" + id,
        postData
      )
      .subscribe(response => {
        alert(response.message);
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const newComment: Comment = {comment, commentator:response.commenter.toString()};
        postOld.comments.push(newComment);
        const post: Post = {
          id: postOld.id,
          title: postOld.title,
          content: postOld.content,
          imagePath: postOld.imagePath,
          creator: postOld.creator,
          likes: response.post.likes,
          dislikes: response.post.dislikes,
          img: postOld.img,
          comments: postOld.comments,
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
