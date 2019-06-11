import { FormHelper } from 'src/app/helpers/form-helper';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
/*import { JarwisService } from '../../../services/auth/jarwis.service';*/
import { TokenService } from '../../../services/auth/token.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  public loginform = {
    email: null,
    password: null,
    remmber_me: null
  };
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public error = '';

  constructor(
    private Token: TokenService,
    private router: Router,
    private Auth: AuthService,
    private formHelper: FormHelper
  ) {}

  ngOnInit() {
    this.logout();
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      remember_me: new FormControl('')
    });
  }

  onSubmit() {
    this.formHelper.validateAllFormFields(this.loginForm);
    if (this.loginForm.valid) {
      this.submitted = true;
      this.loading = true;
      this.Auth.login(this.loginForm.value).subscribe(
        data => this.handleResponse(data),
        error => this.handleError(error)
      );
      this.loading = false;
    }
  }
  handleResponse(data) {
    if (data.access_token) {
      this.Token.handle(data.access_token);
      this.Auth.changeAuthStatus(true);
      this.router.navigateByUrl('/');
    } else {
      this.handleError(data);
    }
  }
  handleError(error) {
    if (error.status === 401) {
      this.error = 'email or password is not correct';
    } else {
      this.error = 'Something went wrong. please try again later.';
    }
    console.log(error);
    // this.error = error.error.message;
  }

  logout() {
    this.Auth.logOut();
    this.Token.remove();
  }
}
