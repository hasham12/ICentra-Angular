import { Component, OnInit  } from '@angular/core';
import { AuthService } from './../../services/auth/auth.service';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public AuthUser: any;
  public taskStatusDProgress: any;
  public getDate: Date;
  public hrs: any;
  public greet: any;
  public monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  currentMonthYear: any;

  constructor(private Auth: AuthService, private api: ApiService) {
     this.getDate = new Date();
    this.hrs = this.getDate.getHours();
    if (this.hrs < 12) {
        this.greet = 'Good Morning';
      } else if (this.hrs >= 12 && this.hrs <= 17) {
        this.greet = 'Good Afternoon';
      } else if (this.hrs >= 17 && this.hrs <= 24) {
        this.greet = 'Good Evening';
      }
  }
  ngOnInit() {
    this.Auth.UserSub.subscribe(user => {
        this.AuthUser = user;
      });
    this.api.get('/tasks/dashboard').subscribe( res => {
        this.taskStatusDProgress = res.byTasks;
    });
    const d = new Date();
    this.currentMonthYear = this.monthNames[d.getMonth()] + ' ' + d.getFullYear();
    console.log(this.currentMonthYear);
  }




  // Chart
  public barChartLabels = ["July', 'June', 'May', 'April', 'March"];
  public barChartType   = 'horizontalBar';
  public barChartLegend = true;
  public barChartData   = [
    {data: [100, 50, 60, 70, 40], label: 'Revenue'},
  ];
  public barChartOptions = {
     scaleShowVerticalLines: false,
     responsive: true,
  };




}
