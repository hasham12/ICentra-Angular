import { PusherService } from './../../services/pusher.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from './../../models/user.model';
import { ApiService } from './../../services/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.css']
})
export class FullComponent implements OnInit {

  constructor(private Api: ApiService, private Auth: AuthService) {  }
  public User: User;


  ngOnInit() {
    this.getAuthUser();
  }
  getAuthUser() {
    this.Api.get('/me?include=offices,permissions,groups').subscribe(
      data => {
        this.User = data.data as User;
        this.Auth.setAuthUser(this.User);
      }
    );
  }
}
