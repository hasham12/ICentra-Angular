import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { TokenService } from './token.service';

@Injectable()
export class AfterLoginService implements CanActivate {

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    console.log('token service ' + this.Token.loggedIn());
    if (!this.Token.loggedIn()) {
      // redirect to some login page
      this.router.navigateByUrl('/login');
      //this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
      return false;
    } else {
      this.auth.loadPermissions();
      return true;
    }
  }
  constructor(private Token: TokenService, private router: Router, private auth: AuthService) { }

}
