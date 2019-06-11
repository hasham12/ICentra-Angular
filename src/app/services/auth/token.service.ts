import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';


@Injectable()
export class TokenService {
  private baseUrl = environment.apiUrl + '/' + environment.api_prefix;
  private iss = {
    login: this.baseUrl + '/auth/login',
  };

  constructor(private http: HttpClient, private router: Router) { }

  handle(token) {
    this.set(token);
  }

  set(token) {
    localStorage.setItem('token', token);
  }

  get() {
    return localStorage.getItem('token');
  }

  remove() {
    localStorage.removeItem('token');
    localStorage.clear();
  }

  isValid() {
    const token = this.get();
    console.log('token is ' + token);

    if (token) {
      const payload = this.payload(token);
      // console.log('payload now ' + payload.iss);
      // console.log('payload now ' + this.iss.login);
      // console.log(Object.values(this.iss).indexOf(payload.iss));
      if (payload) {
        return payload.iss === this.iss.login;
        // return Object.values(this.iss).indexOf(payload.iss) > -1 ? true : false;
      }

    }
    return false;
  }

  payload(token) {
    // console.log('before token is ' + token);
    const payload = token.split('.')[1];
    // console.log('payload is ' + payload);
    return this.decode(payload);
  }

  decode(payload) {
    return JSON.parse(atob(payload));
  }

  loggedIn() {
    return this.isValid();
  }

  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);

    if (decoded.exp === undefined) { return null; }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isTokenExpired(token?: string): boolean {
    if (!token) { token = this.get(); }
    if (!token) { return true; }

    const date = this.getTokenExpirationDate(token);
    if (date === undefined) { return false; }
    return !(date.valueOf() > new Date().valueOf());
  }
  responseToToken(response) {
    if (response.access_token) {
      this.handle(response.access_token);
      return response.access_token;
    } else {
      this.router.navigateByUrl('/login');
    }
  }
  tokenError(error) {
    this.remove();
    this.router.navigateByUrl('/login');
  }
  refreshToken() {
    return this.http.post(`${this.baseUrl}/auth/refresh`, '');
  }
}
