import { ApiService } from 'src/app/services/api.service';
import { FormHelper } from './../../../helpers/form-helper';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
  constructor(private formHelper: FormHelper, private Api: ApiService, private route: ActivatedRoute) {}
  public error: any;
  public success: any;
  public token: any;
  public ResetFrom: FormGroup;
  public loading = false;
  public submitted = false;
  private sub: any;
  public validToken: any;
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.token = params['token'];
      this.checkToken( this.token);
    });

    this.ResetFrom = new FormGroup({
      token: new FormControl(this.token),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      password_confirmation: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
  }

  resetPassword() {
    this.formHelper.validateAllFormFields(this.ResetFrom);
    if (this.ResetFrom.valid) {
      this.loading = true;
      this.Api.post('/password/reset', this.ResetFrom.value).subscribe(
        data => {
          // this.loading = false;
          this.submitted = true;
          this.success = 'Password has been reset. You can now login.';
          console.log(data);
        },
        error => {
          this.loading = false;
          console.log(error);
          if (error.status === 404) {
            this.error = error.error.message;
          } else {
            this.error = 'Something went wrong please try again later';
          }
        }
      );
    }
  }
  checkToken(token: any) {
    if (token) {
      this.Api.get('/password/token/' + token).subscribe(
        response => {
            this.validToken = true;
            console.log('valid token ' + this.validToken);
        },
        error => {
          this.validToken = false;
          this.error = 'Password Reset Request is not valid. Please request again.';
          console.log('valid token ' + this.validToken);
        }
      );
    }
  }
}
