import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.css']
})
export class AddRoleComponent implements OnInit {
  constructor(
    private Api: ApiService,
    private router: Router,
    private toastr: ToastrService
  ) {}
  RoleForm: FormGroup;
  public Role: any;
  public submitted = false;
  public error = null;
  ngOnInit() {
    this.RoleForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(),
    });


  }

  addRole() {
    if (this.RoleForm.invalid) {
      return false;
    }
    this.Api.post('/roles', this.RoleForm.value).subscribe(
      data => {
        this.toastr.success('Role has been created.');
        this.router.navigateByUrl('/setting/list/permissions');
      },
      error => {
        this.error = Array.of(error.error.errors);
        if (error.message && error.status_code !== 500) {
          this.toastr.error(this.error, error.error.message);
        } else {
          this.toastr.error('Something wrong with the form. Please check and try again.');
        }
        console.log('Role error is ' + this.error);
      }
      // this.response = data;
    );
  }
}
