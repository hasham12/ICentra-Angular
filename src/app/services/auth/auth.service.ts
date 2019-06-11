import { PusherService } from 'src/app/services/pusher.service';
import { User } from './../../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TokenService } from './token.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.Token.loggedIn());
  authStatus = this.loggedIn.asObservable();
  public UserSub = new BehaviorSubject<boolean>(this.Token.loggedIn());
  AuthUser = this.loggedIn.asObservable();
  private apiUrl  = environment.apiUrl;
  public baseUrl = environment.apiUrl + '/' + environment.api_prefix;

  changeAuthStatus(value: boolean) {
    this.loggedIn.next(value);
  }
  setAuthUser(User: any) {
    this.UserSub.next(User);
    this.permissionsService.loadPermissions(User.permissions.data);
    localStorage.setItem('_per', JSON.stringify(User.permissions.data));
  }
  constructor(private Token: TokenService, private http: HttpClient, private router: Router,
     private permissionsService: NgxPermissionsService) {
    }

   login(data) {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  sendPasswordResetLink(data) {
    return this.http.post(`${this.baseUrl}/sendPasswordResetLink`, data);
  }

  changePassword(data) {
    return this.http.post(`${this.baseUrl}/resetPassword`, data);
  }

  public logOut() {
    this.http.post(`${this.baseUrl}/auth/logout`, '');
    this.Token.remove();

    return this.router.navigateByUrl('/login');
  }

  public loadPermissions() {
    let permissions: any;
    permissions = localStorage.getItem('_per');
    //permissions = <Array<any>>permissions;
    if(permissions) {
      console.log('permissions are ');
      console.log(JSON.parse(permissions));
      this.permissionsService.loadPermissions(JSON.parse(permissions));
    }
  }
  getUser(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/me?include=offices,permissions,groups`).pipe(delay(1000));
  }

}
