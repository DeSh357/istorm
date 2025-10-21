import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {UserInfoType} from "../../../../types/user-info.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";

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
  activeSection: string = '';

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
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.activeSection = ''; // сброс при каждой смене страницы
    });
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

  scrollTo(page: string,fragment?: string) {
    this.activeSection = '';
    if (fragment) {
      if (this.router.url !== page) {
        this.router.navigate([page]).then(() => {
          if (fragment) {
            setTimeout(() => this.scroll(fragment), 100);
          }
        });
      } else {
        this.scroll(fragment);
      }
    }
  }

  private scroll(fragment: string) {
    const element = document.getElementById(fragment);
    this.activeSection = fragment;
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - 130;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}
