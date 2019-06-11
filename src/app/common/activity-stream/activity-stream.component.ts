import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

import { ActivityService } from './../../services/activity/activity.service';

import { environment } from './../../../environments/environment.prod';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth/auth.service';
import { TokenService } from './../../services/auth/token.service';
import { PusherService } from 'src/app/services/pusher.service';
import { TimeAgoPipe } from 'time-ago-pipe';


@Component({
  selector: 'app-activity-stream',
  templateUrl: './activity-stream.component.html',
  styleUrls: ['./activity-stream.component.css']
})
export class ActivityStreamComponent implements OnInit {
  public inset2dark = {axis: 'y'};
	isActiveStream : boolean = false;

	activities: any= {}

	 
	pageNum: number;
	constructor(private activity: ActivityService,
	  private datePipe: DatePipe,
		private Auth: AuthService,
		private Http: HttpClient,
		private toastr: ToastrService,
		private api: ApiService) { }
  
  ngOnInit() {
			 this.getActivities();
		   console.log(this.activities);
			// Activity Stream
			$(".activity-opner").on('click', function(e) {
			    e.preventDefault();
			    $(".activity-stream").show();
		    	$(".activity-stream").addClass('show');
		    	$(".activity-stream").removeClass('hide');
		    	$(this).addClass('hide');
			});
			$(".close-stream").on('click', function(e) {
			    e.preventDefault();
		    	$(".activity-stream").removeClass('show');
		    	$(".activity-stream").addClass('hide');
		    	$(".activity-stream").fadeOut(700);

				    $(".activity-opner").delay(500).queue(function(next){
					    $(this).removeClass("hide");
					    next();
					});
			});
			$('.cancelbtn').on('click', function() {
			    $('.modal-popup-wrap').fadeOut();
			});
			// Reply Toggler
			$(".reply-toggler").on('click', function(e) {
			    e.preventDefault();
			    $("body").toggleClass("reply-toggled");
			    $(this).parent().parent('.stream-metadata').parent('.stream-list-content').find('.reply-form').slideToggle();
			});

	}
	

	getActivities() {
		this.activity.getActivities().subscribe(response => {
				console.log(response);
		  	this.activities = response.data;
		  	this.pageNum = response.meta.pagination.current_page;
			});
	}
}




