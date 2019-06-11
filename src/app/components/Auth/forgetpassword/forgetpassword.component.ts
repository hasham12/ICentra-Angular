import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TokenService } from 'src/app/services/auth/token.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormHelper } from 'src/app/helpers/form-helper';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css']
})
export class ForgetpasswordComponent implements OnInit {
  public forgotForm: FormGroup;
  constructor(
    private Token: TokenService,
    private Api: ApiService,
    private formHelper: FormHelper
  ) {}
  public submitted: true;
  public loading = false;
  public error: any;
  ngOnInit() {
    this.forgotForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  logout() {
    this.Token.remove();
  }
  onSubmit() {
    this.error = '';
    this.formHelper.validateAllFormFields(this.forgotForm);
    if (this.forgotForm.valid) {
      this.loading = true;
      this.Api.post('/password/forgot', this.forgotForm.value).subscribe(
        data => {
          this.loading = false;
          this.submitted = true;
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
}
