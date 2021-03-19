import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public authService: AuthService) {}

  onLogin(form: NgForm)
  {
    if(form.invalid) {
      alert('Invalid input');
      return;
    }

    this.authService.login(form.value.userName, form.value.password);

  }

  ngOnInit() {
  }

}
