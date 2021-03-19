import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";

import { AuthData } from "./auth-data.model";
import { Router } from "@angular/router";

export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private adminStatusListener = new Subject<boolean>();

  private tokenTimer :NodeJS.Timer;
  private userId: string;
  private userName: string;

  private isAdmin = false;
  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }
  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getAdminStatusListener() {
    return this.adminStatusListener.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  getUserName(){
    return this.userName;
  }

  userIsAdmin() {
    return this.isAdmin;
  }

  createUser(username: string, password: string) {
    const authData: AuthData = { username: username, password: password };
    this.http
      .post("http://localhost:3000/api/user/signup", authData)
      .subscribe(response => {
        console.log(response);
      });
  }


  login(username: string, password: string) {
    const authData: AuthData = { username: username, password: password };
    this.userName=username;
    this.http
      .post<{ token: string; expiresIn: number , userId : string }>(
        "http://localhost:3000/api/user/login",
        authData
      )
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if (token) {

          if(authData.username == 'vladimir'){
            this.isAdmin=true;
          }

          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.userId= response.userId;
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.adminStatusListener.next(this.isAdmin);

          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration *1000)
          this.saveAuthData(token,expirationDate,this.userId,this.isAdmin,username);
          console.log(expirationDate);
          this.router.navigate(['/create']);
        }
      });
  }

  autoAuthUser() {
   const authInformation= this.getAuthData();
   if(!authInformation)
   {
     return;
   }
   const now = new Date();
   const expiresIn= authInformation.expirationDate.getTime() - now.getTime() ;
   if(expiresIn > 0) {
     this.token= authInformation.token;
     this.isAuthenticated = true;
     this.isAdmin=authInformation.admin;
     this.userId = authInformation.userId;
     this.userName = authInformation.username;

     this.setAuthTimer(expiresIn/1000);
     this.adminStatusListener.next(this.isAdmin);
     this.authStatusListener.next(true);
   }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.userId = null;
    this.authStatusListener.next(false);
    this.adminStatusListener.next(false);

    clearTimeout(this.tokenTimer);
    this.userName=""
    this.clearAuthData();
    this.router.navigate(['/']);
  }
  //date da bi imali jasnu ideju o tome kad istice sati su previse relativan pojam
  //ISOS string je serializovani string koji posel moze da se vrati u staro stanje
  private saveAuthData(token:string, expirationDate: Date,userId:string,isAdmin:boolean,username:string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId',userId);
    localStorage.setItem('admin',isAdmin.toString());
    localStorage.setItem('username',username);

  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('admin');
    localStorage.removeItem('username');



  }

  private setAuthTimer (duration: number) {
    console.log("seting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const admin:boolean = (Boolean)(localStorage.getItem('admin'));

    if(!token || !expirationDate){
      return;
    }

    return {
      token:token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      admin: admin,
      username:username
    }
  }
}
