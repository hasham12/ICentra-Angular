import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth/auth.service';
import { environment } from 'src/environments/environment';
declare const Pusher: any;

@Injectable({
  providedIn: 'root'
})
export class PusherService {
  pusher: any;
  channel: any;
  AuthUser: any;
  constructor(private http: HttpClient, private Auth:AuthService) {

    this.pusher = new Pusher(environment.PUSHER_KEY, {
      logToConsole: true,
      cluster: environment.PUSHER_CLUSTER,
      encrypted: true,
      forceTLS: true,
      authEndpoint : environment.apiUrl + '/' + environment.api_prefix + '/auth/pusherauth',
    });
    this.pusher.logToConsole = true;
    //console.log(this.Auth.baseUrl + '/auth/pusherauth');

    //this.channel = this.pusher.subscribe('private-App.User.1');
    setTimeout(() => {
        this.Auth.UserSub.subscribe(user => {
          this.AuthUser = user;
        });
        if (this.AuthUser.id) {
          this.channel = this.pusher.subscribe('private-App.User.' + this.AuthUser.id);
          console.log(this.channel);
        }
      }, 4000);
  }
}
