import { AuthService } from './auth/auth.service';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public baseUrl = environment.apiUrl + '/' + environment.api_prefix;
  public url = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService
  ) {}

  get(url, params = null): Observable<any> {
    if (params) {
      return this.http
        .get(this.baseUrl + url, {
          params
        })
        .pipe(
          map(this.handleResponse),
          catchError(this.handleError)
        );
    }
    return this.http.get(this.baseUrl + url).pipe(
      map(this.handleResponse),
      catchError(this.handleError)
    );
  }

  post(url, params): Observable<any> {
    return this.http.post(this.baseUrl + url, params).pipe(
      map(this.handleResponse),
      catchError(this.handleError)
    );
  }

  put(url, params): Observable<any> {
    return this.http.put(this.baseUrl + url, params).pipe(
      map(this.handleResponse),
      catchError(this.handleError)
    );
  }

  delete(url): Observable<any> {
    return this.http.delete(this.baseUrl + url).pipe(
      map(this.handleResponse),
      catchError(this.handleError)
    );
  }

  public handleResponse(data) {
    //console.log('server sent this data' + JSON.stringify(data));
    if (
        data &&
      data.status_code &&
      (data.status_code === 401)
    ) {

        window.location.href = "/icentra-app/#/login";

    }
    return data;
  }

  public handleError(error) {
    if (error.status === 401 || error.status_code === 403) {
      localStorage.removeItem('token');
      localStorage.clear();
      window.location.href = "/icentra-app/#/login";
      this.auth.logOut();
    }
    return throwError(error);
  }
}
