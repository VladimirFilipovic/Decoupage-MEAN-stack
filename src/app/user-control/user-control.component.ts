import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PostService } from "../post/posts.service";
import { UserService } from "./user.service";
import { Subscription } from "rxjs";
import { User } from "./user.model";

@Component({
  selector: "app-user-control",
  templateUrl: "./user-control.component.html",
  styleUrls: ["./user-control.component.css"]
})
export class UserControlComponent implements OnInit, OnDestroy {
  @ViewChild("closeAddExpenseModal", { static: false })
  closeAddExpenseModal: ElementRef;
  @ViewChild("closeAddExpenseModal1", { static: false })
  closeAddExpenseModal1: ElementRef;

  form: FormGroup;
  formUpdate: FormGroup
  private userSub: Subscription;
  usersList: User[] = [];
  userId:string;

  constructor(public userService: UserService) {
    this.form = new FormGroup({
      username: new FormControl(null, {
        validators: [Validators.required,Validators.minLength(5), Validators.pattern('^[a-zA-Z ]*$')]
      }),
      password: new FormControl(null, { validators: [Validators.required,Validators.minLength(5) ]})
    });

    this.formUpdate = new FormGroup({
      usernameUpdate: new FormControl(null, {
      validators: [Validators.required,Validators.minLength(5), Validators.pattern('^[a-zA-Z ]*$') ]
      }),
      passwordUpdate: new FormControl(null, { validators: [Validators.required,Validators.minLength(5) ] })
    });

  }

  ngOnInit() {
    this.userService.getUsers();
    this.userSub = this.userService
      .getUserUpdateListener()
      .subscribe((users: User[]) => {
        this.usersList = users;
      });
  }

  onAddUser() {
    if (this.form.invalid) {
      alert('Invalid input');
      return;
    }
    this.userService.createUser(
      this.form.value.username,
      this.form.value.password
    );
    this.closeAddExpenseModal.nativeElement.click();
    this.form.reset();
  }

  onUpdate(userId: string, username: string, password: string) {
    this.formUpdate.setValue({
      passwordUpdate: password,
      usernameUpdate:username,
    });
    this.userId = userId;

  }

  onUpdateUser() {
    if (this.formUpdate.invalid) {
      alert('Invalid input');
      return;
    }
    this.userService.updateUser(
      this.userId,
      this.formUpdate.value.usernameUpdate,
      this.formUpdate.value.passwordUpdate,
    );


    this.closeAddExpenseModal1.nativeElement.click();
    this.formUpdate.reset();

  }

  onDelete(userId: string) {

      this.userService.deleteUser(userId);

  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
