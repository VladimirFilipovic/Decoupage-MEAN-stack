import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { PostListComponent } from './post/post-show/post-list.component';
import { PostCreateComponent } from './post/post-create/post-create.component';
import { AppComponent } from './app.component';
import { PostWrapComponent } from './post/post-wrap/post-wrap.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
import { PostWrapMygalleryComponent } from './post/post-wrap-mygallery/post-wrap-mygallery.component';
import { UserControlComponent } from './user-control/user-control.component';
import { PostArtistPageComponent } from './post/post-artist-page/post-artist-page.component';
import { DonationComponent } from './donation/donation.component';

const routes: Routes = [
  { path: '', component:  HomeComponent},
  { path: 'create',  component: PostWrapComponent},
  { path: 'mygallery',  component: PostWrapMygalleryComponent,canActivate:[AuthGuard]},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'users', component:UserControlComponent,canActivate:[AuthGuard]},
  { path: 'artistGallery',component:PostArtistPageComponent},
  { path: 'donate',component:DonationComponent}
];
//guard se ubacuje ovde i izvrsava s e pri poksuaju pristupa
@NgModule({
imports: [RouterModule.forRoot(routes)],
exports: [RouterModule],
providers: [AuthGuard]
})
export class AppRoutingModule {}
