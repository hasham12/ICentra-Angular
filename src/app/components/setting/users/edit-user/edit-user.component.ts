import { FormHelper } from './../../../../helpers/form-helper';
import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  constructor(
    private Api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private formhelper: FormHelper
  ) {}
  public user_id: null;
  public sub;
  public User = new User();
  public UserForm: FormGroup;
  public error: any;
  public FormCreated: boolean;
  public userLoaded: boolean;
  public userFrom: boolean;
  public response: any;
  public roles: any;
  public groups: any;
  public offices: any;
  public selectedGroups: Array<any>;
  public selectedOffices: any;
  levels: any;
  public url: any;
  public randomstring: any;

  passType = 'password';

  ngOnInit() {
    this.createForm();
    this.sub = this.route.params.subscribe(params => {
      this.user_id = params['id'];
      this.getUser(this.user_id);
    });
    this.getRoles();
    this.getGroups();
    this.getOffices();
    this.Api.get('/user-levels').subscribe(res => {
      this.levels = res.data.map((i) => { i.name = i.title + ' - ' + i.discount + '%'; return i; });
    });
  }

  getUser(user_id = null) {
    if (user_id != null) {
      this.Api.get('/users/' + user_id + '?include=groups,offices').subscribe(
        res => {
          this.User = res.data;
          this.userLoaded = true;
          this.UserForm.patchValue(this.User);
          this.UserForm.controls['photo'].reset();
          this.selectedGroup();
          this.selectedOffice();
        },
        error => {
          console.log('the error is ', JSON.stringify(error));
        }
      );
    }
  }
  selectedGroup() {
    if (this.User.groups.data !== undefined) {
      const Groups = this.User.groups.data;
      if (Groups[0] !== undefined) {
        this.selectedGroups = [];
        Groups.forEach(g => {
          if (g.id !== undefined) {
            this.selectedGroups.push(g.id);
          }
        });
        this.UserForm.controls['group'].setValue(this.selectedGroups);
      }
    }
  }
  selectedOffice() {
    if (this.User.offices.data !== undefined) {
      const Office = this.User.offices.data;
      if (Office[0] !== undefined) {
        this.selectedOffices = [];
        Office.forEach(g => {
          if (g.id !== undefined) {
            this.selectedOffices.push(g.id);
          }
        });
        this.UserForm.controls['office'].setValue(this.selectedOffices);
      }
    }
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
  createForm() {
    this.UserForm = new FormGroup({
      username: new FormControl({ value: '', disabled: true }),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      photo: new FormControl(),
      password: new FormControl('', [
        /*Validators.minLength(8)*/
      ]),
      user_level_id: new FormControl(),
      mobile: new FormControl(),
      position: new FormControl(),
      bio: new FormControl(),
      role_id: new FormControl('', [Validators.required]),
      office: new FormControl('', [Validators.required]),
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
    this.FormCreated = true;
  }

  updateUser() {
    this.formhelper.validateAllFormFields(this.UserForm);

    if (this.UserForm.invalid) {
      console.log('form isnt validated yet');
      return;
    }
    console.log(this.UserForm.value);
    this.Api.put('/users/' + this.user_id, this.UserForm.value).subscribe(
      data => {
        this.response = data;
        this.toastr.success('User has been updated');
        this.router.navigateByUrl('/setting/list');
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

  getOffices() {
    this.Api.get('/offices', { per_page: 'all' }).subscribe(data => {
      this.offices = data.data;
    });
  }

  OnDestroy() {
    this.sub.unsubscribe();
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
