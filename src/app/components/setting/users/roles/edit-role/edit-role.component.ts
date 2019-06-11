import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.css']
})
export class EditRoleComponent implements OnInit {
  constructor(
    private Api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}
  RoleForm: FormGroup;
  public Role: any;
  public sub: any;
  public error = null;
  public role_id: string;
  ngOnInit() {
    this.RoleForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(),
    });

    this.sub = this.route.params.subscribe(params => {
      this.role_id = params['id'];
      this.getRole(this.role_id);
    });

  }

  getRole(id = null) {
    if (id) {
      this.Api.get('/roles/' + id).subscribe(data => {
        this.Role = data.data;
        this.RoleForm.patchValue(this.Role);
      },
      error => {
        this.error  = error;
      });
    }
  }
  updateRole() {
    if (this.RoleForm.invalid && this.role_id) {
      console.log('invalid form' + this.RoleForm.invalid);
      return false;
    }
    this.Api.put('/roles/' + this.role_id, this.RoleForm.value).subscribe(
      data => {
        this.toastr.success('Role has been updated.');
        this.router.navigateByUrl('/setting/list/roles');
      },
      error => {
        this.error = Array.of(error.error.errors);
        this.toastr.success('Somthing wrong with the form. Please check and try again.');
        console.log('Role error is ' + this.error);
      }
      // this.response = data;
    );
  }
}
