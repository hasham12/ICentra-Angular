import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from './../../../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormHelper } from 'src/app/helpers/form-helper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-your-profile',
  templateUrl: './your-profile.component.html',
  styleUrls: ['./your-profile.component.css']
})
export class YourProfileComponent implements OnInit {
  response: any;
  error: any;
  constructor(private Auth: AuthService, private Api: ApiService, private formHelper: FormHelper,
  private toastr: ToastrService, private router: Router) { }

  public url: any;
  public randomstring: any;

  passType = 'password';
  public AuthUser: any;
  public UserForm: FormGroup;
  public loading = false;
  public groups: any;
  public offices: any;
  public User: any;
  ngOnInit() {
    this.Auth.UserSub.subscribe(user => {
      this.AuthUser = user;
    });
    this.UserForm = new FormGroup({
      id: new FormControl({ value: '', disabled: true }),
      username: new FormControl({ value: '', disabled: true }),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      photo: new FormControl(),
      password: new FormControl(''),
      mobile: new FormControl(),
      position: new FormControl(),
      bio: new FormControl(),
      role: new FormControl({ value: '', disabled: true }),
      office: new FormControl({ value: '', disabled: true }),
      group: new FormControl({ value: '', disabled: true}),
      facebook: new FormControl(),
      twitter: new FormControl(),
      instagram: new FormControl(),
      linkedin: new FormControl(),
      website: new FormControl(),
      crm_email: new FormControl(),
      crm_password: new FormControl(),
    });
    this.getUser();
  }

  getUser() {
      this.Api.get('/me?include=permissions,offices,groups').subscribe(
        res => {
          this.User = res.data;
          this.Auth.setAuthUser(this.User);
          this.UserForm.patchValue(this.User);
          this.UserForm.controls['photo'].reset();
          this.selectedGroup();
          this.selectedOffice();
        },
        error => {
          console.log('the error is Loading your Profile.');
        }
      );
  }
  selectedGroup() {
    if (this.User.groups.data !== undefined) {
      let Groups = this.User.groups.data;
      this.groups = Groups;
      if (Groups[0] !== undefined) {
        let selectedGroups = [];
        Groups.forEach(g => {
          if (g.name !== undefined) {
            selectedGroups.push(g.name);
          }
        });
        this.UserForm.controls['group'].setValue(selectedGroups.join(', '));
      }
    }
  }
  selectedOffice() {

    if (this.User.offices.data !== undefined) {
      let Office = this.User.offices.data;
      this.offices = Office;
      if (Office[0] !== undefined) {
        let selectedOffice = [];
        Office.forEach(g => {
          if (g.name !== undefined) {
            selectedOffice.push(g.name);
          }
        });
        this.UserForm.controls['office'].setValue(selectedOffice.join(', '));

      }
    }
  }


  updateProfile() {
    this.formHelper.validateAllFormFields(this.UserForm);
    if (this.UserForm.invalid) {
      console.log('form is invalid');
      return;
    }
    this.loading = true;
    console.log(this.UserForm.value);
    this.Api.post('/me', this.UserForm.value).subscribe(
      data => {
        this.response = data;
        this.toastr.success('Profile has been updated');
        this.getUser();
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
    this.loading = false;
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
    this.randomstring = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
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

