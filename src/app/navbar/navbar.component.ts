import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthService} from '../auth/auth.service';


@Component({
 selector: 'app-navbar',
 templateUrl: './navbar.component.html',
 styleUrls: ['./navbar.component.css']

})

export class NavbarComponent implements OnInit,OnDestroy {
  userIsAuthenticated = false;
  userIsAdmin = false;
  username="";

  private authListenerSubs: Subscription;
  adminListenerSubs: Subscription;



  constructor(private authService: AuthService) {}

  ngOnInit() {

    this.userIsAuthenticated = this.authService.getIsAuth();

    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated =>{
      this.userIsAuthenticated= isAuthenticated;

    });

    this.adminListenerSubs = this.authService.getAdminStatusListener().subscribe(isAdmin =>{
      this.userIsAdmin= isAdmin;
    });


  }

  onLogout() {
    this.userIsAdmin=false;
    this.authService.logout();
  }

  ngOnDestroy() {
    this.userIsAdmin=false;

    this.authListenerSubs.unsubscribe();
    this.adminListenerSubs.unsubscribe();
  }
}
