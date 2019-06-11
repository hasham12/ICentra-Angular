import {
  AuthService
}
from './../../services/auth/auth.service';
import {
  User
}
from './../../models/user.model';
import {
  Component,
  OnInit,
  Input
}
from '@angular/core';
import {
  Router
}
from '@angular/router';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public ActiveClass = "";
  public ShowClass = "";
  constructor(private Auth: AuthService, private router: Router) {
    // router.events.subscribe(url => {
    //       if(this.router.url == '/setting/groups'){
    //         this.ActiveClass  = 'active';
    //         this.ShowClass    = 'show';
    //       }
    // });
  }
  public AuthUser: any;
  ngOnInit() {
    this.Auth.UserSub.subscribe(user => {
      this.AuthUser = user;
    });
    $("#sidebarToggle").on('click', function(e) {
      e.preventDefault();
      if ($(this).hasClass("isDown")) {
        $(".sidebar").stop().animate({
          width: "180px"
        });
        window.setTimeout(function() {
          $(".sidebar").removeClass("toggled");
        }, 200);
      }
      else {
        $(".sidebar").stop().animate({
          width: "55px"
        });
        window.setTimeout(function() {
          $(".sidebar").addClass("toggled");
        }, 300);
      }
      $(this).toggleClass('isDown');
      $("body").toggleClass("sidebar-toggled");
      $(".page-zoom").toggleClass('active');
      $('.xen-navbar-nav li.nav-item a.nav-link').addClass('collapsed');
      $('.sub-menu.collapse').removeClass('show');
      window.dispatchEvent(new Event('resize'));
      return false;
    });
    $(document).on('click', '.toggled .sub-menu .dropdown-item', function(e) {
      //console.log('hello');
      $(this).parent().addClass('collapse');
      $(this).parent().removeClass('collapsed');
      $(this).parent().removeClass('show');
    });
    // Prevent Dropdown Menu
    $('.dropdown-menu').click(function(e) {
      //e.stopPropagation();
    });

  }
  logout() {
    this.Auth.logOut();
  }
}