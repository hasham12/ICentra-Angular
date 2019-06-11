import { environment } from './../../../environments/environment.prod';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth/auth.service';
import { TokenService } from './../../services/auth/token.service';
import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { PusherService } from 'src/app/services/pusher.service';
import {TimeAgoPipe} from 'time-ago-pipe';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public inset2dark = { axis: 'y'};

  public AuthUser: any;
  public notifications  = [];
  public env = environment;
  public countHide = false;
  constructor(
    private router: Router,
    private Token: TokenService,
    private Auth: AuthService,
    private pusherService: PusherService,
    private Api: ApiService,

  ) {

  }

  ngOnInit() {
    this.Auth.UserSub.subscribe(user => {
      this.AuthUser = user;
    });
    this.Api.get('/notifications', { per_page: 'all'}).subscribe(
      res => {
        this.notifications = res.data;
        console.log('Notifications');
        console.log(JSON.stringify(res.data));
        this.countHide = false;
      }
    );
    //this.pusherService.connect(this.AuthUser.id);
    setTimeout(() => {
      if(this.AuthUser.id) {
        console.log('binding channel for user ' + this.AuthUser.id);
        this.pusherService.channel.bind('Illuminate\\Notifications\\Events\\BroadcastNotificationCreated', data => {
          console.log('Pusher data');
          console.log(JSON.stringify(data));
          this.notifications.unshift({'data':data});
          this.countHide=false;
        });
      }
    }, 5000);



    let xen_main_navbar       = $('.xen-main-navbar').outerHeight();
    let welcome_message       = $('.welcome-message').outerHeight();
    let welcome_outer_content = $('.welcome-outer-content').outerHeight();

    $('.scrollbox-content').height(xen_main_navbar + welcome_message + welcome_outer_content);

  }

  logout() {
    this.Auth.logOut();
  }

  notificationRead(notification) {
    const id = notification.id ? notification.id : notification.data.id;
    this.notifications.splice(this.notifications.indexOf(notification), 1);
    if (id) {
      this.Api.post('/notification/read', { read: id }).subscribe(
        res => console.log(res)
      );
    }
  }
  readAllNotifications(){
    this.notifications = [];
    this.Api.post('/notification/read', { read: 'all'}).subscribe(
      res => console.log(res)
    );
  }
  thumb(thumb){
    return this.env.S3 + '/photos/' + thumb;
  }
}
