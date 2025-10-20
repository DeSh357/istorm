import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {UserInfoType} from "../../../../types/user-info.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLogged: boolean;
  userName: string | null = null;
  userEmail: string| null = null;
  userId: string | null = null;

  constructor(private authService: AuthService, private _snackBar: MatSnackBar, private router: Router) {
    this.isLogged = this.authService.getIsLoggedIn();
    if (this.isLogged) {
      this.getUserInfo();
    }
  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe(isLogged => {
      this.isLogged = isLogged;

      if (this.isLogged) {
        this.getUserInfo();
      }
    })
  }

  logout() {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogout();
        },
        error: () => {
          this.doLogout();
        }
      });
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.userName = null;
    this.userId = null;
    this.userEmail = null;
    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }

  getUserInfo() {
    this.authService.getUserInfo()
      .subscribe({
        next: (data: DefaultResponseType | UserInfoType) => {
          let error = null;
          if ((data as DefaultResponseType).error !== undefined) {
            error = (data as DefaultResponseType).message;
          }

          const userInfo = data as UserInfoType;
          if (!userInfo.name || !userInfo.email || !userInfo.id) {
            error = 'Ошибка авторизации';
          }

          if (error) {
            this._snackBar.open(error);
            throw new Error(error);
          }

          this.userName = userInfo.name;
          this.userEmail = userInfo.email;
          this.userId = userInfo.id;
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.message) {
            this._snackBar.open(errorResponse.error.message);
          } else {
            this._snackBar.open('Ошибка авторизации');
          }
        }
      })
  }

}
