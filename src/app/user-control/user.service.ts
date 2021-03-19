import { User } from "./user.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { AuthData } from "../auth/auth-data.model";

export class UserService {
  private users: User[] = [];
  private usersUpdated = new Subject<User[]>();

  constructor(private http: HttpClient) {}

  getUserUpdateListener() {
    return this.usersUpdated.asObservable();
  }

  getUsers() {
    this.http
      .get<{ message: string; users: any }>("http://localhost:3000/api/user")
      .pipe(
        map(userData => {
          return userData.users.map(user => {
            return {
              password: user.password,
              username: user.username,
              id: user._id
            };
          });
        })
      )
      .subscribe(transformedUsers => {
        this.users = transformedUsers;
        this.usersUpdated.next([...this.users]);
      });
  }

  createUser(username: string, password: string) {
    const authData: AuthData = { username: username, password: password };
    this.http
      .post<{ message: string; user: User }>(
        "http://localhost:3000/api/user/signup",
        authData
      )
      .subscribe(response => {
        console.log(response);
        const user: User = {
          id: response.user.id,
          username: response.user.username,
          password: response.user.password
        };
        this.users.push(user);
        this.usersUpdated.next([...this.users]);
      });
  }

  updateUser(id: string, username: string, password: string) {
    const userData: User = {
      id: id,
      username: username,
      password: password
    };
    this.http
      .put<{ message: string }>(
        "http://localhost:3000/api/user/" + id,
        userData
      )
      .subscribe(response => {
        const updatedUsers = [...this.users];
        const oldUserIndex = updatedUsers.findIndex(
          p => p.id === id
        );
        const user: User = {
          id: id,
          username: username,
          password: password
        };
        updatedUsers[oldUserIndex] = user;
        this.users = updatedUsers;
        this.usersUpdated.next([...this.users]);
      });
  }

  deleteUser(userId: string) {
    this.http.delete('http://localhost:3000/api/user/' + userId)
      .subscribe(() => {
        const updatedUsers = this.users.filter(user =>  user.id!==userId);
        this.users=updatedUsers;
        this.usersUpdated.next([...this.users]);
      });
    }

}
