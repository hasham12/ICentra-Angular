import { FormHelper } from 'src/app/helpers/form-helper';
import { User } from './../../../../models/user.model';
import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-new-user',
  templateUrl: './add-new-user.component.html',
  styleUrls: ['./add-new-user.component.css']
})
export class AddNewUserComponent implements OnInit {
  UserForm: FormGroup;
  constructor(
    private Api: ApiService,
    private router: Router,
    private toastr: ToastrService,
    private formHelper: FormHelper,
    private cd: ChangeDetectorRef
  ) {}
  public User: User;
  public submitted = false;
  public error = null;
  public roles: any;
  public groups: any;
  public offices: any;
  public response: any;
  public levels: any;
  public url: any;
  public randomstring: any;

  passType = 'password';

  ngOnInit() {
    this.UserForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern('^[A-Za-z0-9]{1,20}$')
      ]),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      photo: new FormControl(),
      user_level_id: new FormControl(),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ]),
      mobile: new FormControl(),
      position: new FormControl(),
      bio: new FormControl(),
      role_id: new FormControl(null, [Validators.required]),
      office: new FormControl(null, [Validators.required]),
      group: new FormControl(),
      facebook: new FormControl(),
      twitter: new FormControl(),
      instagram: new FormControl(),
      linkedin: new FormControl(),
      website: new FormControl(),
      crm_email: new FormControl('', [Validators.email]),
      crm_password: new FormControl(),
      permissions: new FormControl()
    });
    this.getRoles();
    this.getGroups();
    this.getOffices();

    this.Api.get('/user-levels').subscribe(res => {
      this.levels = res.data.map((i) => { i.name = i.title + ' - ' + i.discount + '%'; return i; });
    });
  }

  AddUser() {
    this.formHelper.validateAllFormFields(this.UserForm);
    if (this.UserForm.invalid) {
      console.log('form is invalid');
      return;
    }
    console.log(this.UserForm.value);
    this.Api.post('/users', this.UserForm.value).subscribe(
      data => {
        this.response = data;
        this.toastr.success('User has been Created');
        return this.router.navigateByUrl('/setting/list');
      },
      error => {
        this.error = Array.of(error.error.errors);
        if (error.message && error.status_code !== 500) {
          this.toastr.error(this.error, error.error.message);
        } else {
          this.toastr.error(
            'Something wrong with the form. Please check and try again.'
          );
        }
        console.log('User error is ' + this.error);
      }
    );
  }

  getRoles() {
    this.Api.get('/roles', { per_page: 'all' }).subscribe(data => {
      this.roles = data.data;
    });
  }

  getGroups() {
    this.Api.get('/groups', { per_page: 'all' }).subscribe(data => {
      this.groups = data.data;
    });
  }
  getOffices() {
    this.Api.get('/offices', { per_page: 'all' }).subscribe(data => {
      this.offices = data.data;
    });
  }

  // Image Upload
  onSelectFile(event) {
    if (event.target.files && event.target.files.length) {
      const fileReader: FileReader = new FileReader();
      fileReader.readAsDataURL(event.target.files[0]);
      fileReader.onload = (event: Event) => {
        this.url = fileReader.result;
        this.UserForm.patchValue({
          photo: fileReader.result
        });
      };
    }
  }

  public delete() {
    this.url = null;
  }

  // Password
  public togglePasswordType() {
    if (this.passType === 'password') {
      this.passType = 'text';
    } else {
      this.passType = 'password';
    }
  }

  public generatePassword() {
    this.randomstring =
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15);
      this.UserForm.controls['password'].patchValue(this.randomstring);
  }

  testRex() {
    const crm_email = this.UserForm.controls['crm_email'].value;
    const crm_password = this.UserForm.controls['crm_password'].value;
    let connectionStatus = false;
    this.Api.post('/rex/test',{ 'crm_email': crm_email, 'crm_password': crm_password }).subscribe(
      res => {
        if(res.token){
          connectionStatus = true;
          // this.UserForm.controls['crm_email'].disable();
          // this.UserForm.controls['crm_password'].disable();
          this.toastr.success('Credentials are valid');
        } else {
          this.toastr.error('Credentials are not valid.');
      }
      }
    );
    return connectionStatus;
  }
}
