import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { TokenService } from '../services/auth/token.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    let token = this.tokenService.get();
    if (!request.url.includes('login')) {
      if (token) {
        if (
          this.tokenService.isTokenExpired() &&
          !request.url.includes('refresh')
        ) {
          // renew token
          this.tokenService.refreshToken().subscribe(
            response => {
              token = this.tokenService.responseToToken(response);
            },
            error => {
              if(error.status === 401){
                window.location.href = "/icentra-app/#/login";
              }
              this.tokenService.tokenError(error);
            }
          );
        }
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }
    return next.handle(request);
  }
}
