import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { PostCreateComponent } from './post/post-create/post-create.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PostListComponent } from './post/post-show/post-list.component';
import { PostService } from './post/posts.service';
import { AuthService } from './auth/auth.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { PostWrapComponent } from './post/post-wrap/post-wrap.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './auth/signup/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { PostShowMygalleryComponent } from './post/post-show-mygallery/post-show-mygallery.component';
import { PostWrapMygalleryComponent } from './post/post-wrap-mygallery/post-wrap-mygallery.component';
import { UserControlComponent } from './user-control/user-control.component';
import { UserService } from './user-control/user.service';
import { PostArtistPageComponent } from './post/post-artist-page/post-artist-page.component';
import { DonationComponent } from './donation/donation.component';
import { PostArtistCreateComponent } from './post/post-artist-create/post-artist-create.component';

@NgModule({
  declarations: [
    PostCreateComponent,
    NavbarComponent,
    PostListComponent,
    PostWrapComponent,
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    PostShowMygalleryComponent,
    PostWrapMygalleryComponent,
    UserControlComponent,
    PostArtistPageComponent,
    DonationComponent,
    PostArtistCreateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule

  ],
  providers: [UserService,PostService,AuthService,{provide: HTTP_INTERCEPTORS, useClass:AuthInterceptor , multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
