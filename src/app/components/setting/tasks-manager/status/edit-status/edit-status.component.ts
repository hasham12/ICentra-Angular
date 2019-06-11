import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../../services/api.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../../environments/environment';
import {saveAs} from 'file-saver';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormHelper} from '../../../../../helpers/form-helper';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../../../../../services/auth/auth.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-edit-status',
  templateUrl: './edit-status.component.html',
  styleUrls: ['./edit-status.component.css']
})
export class EditStatusComponent implements OnInit {
  StatusForm: FormGroup;
  submitted = true;
  searched = '';
  statuses: any;
  editId = null;
  public error = null;
  AuthUser: any;
  constructor(private fb: FormBuilder, private formHelper: FormHelper, private api: ApiService, private router: Router,
              private _location: Location, private Auth: AuthService, private toastr: ToastrService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.Auth.UserSub.subscribe(user => {
      this.AuthUser = user;
      if (this.AuthUser.role_id !== 1) {
        this.toastr.warning('Permission denied - Please contact the Administrator');
        this._location.back();
      }
      console.log(this.AuthUser);
    });
    this.createForm();
    this.activatedRoute.params.subscribe(params => {
      this.editId = params['id'];
      this.api.get('/task-statuses/' + params['id']).subscribe(res => {
        Object.keys(this.StatusForm.controls).forEach(key => {
          this.StatusForm.controls[key].setValue(res.data[key]);
        });
      });
    });
    this.fetchBySearch();
  }

  createForm() {
    this.StatusForm = this.fb.group({
      name: ['', Validators.required],
      color: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;
    this.formHelper.validateAllFormFields(this.StatusForm);
    if (this.StatusForm.invalid) {
      console.log('invalid');
      return;
    }
    this.api.put('/task-statuses/' + this.editId, this.StatusForm.value).subscribe(res => {
      this.toastr.success('Status Updated');
      this.router.navigateByUrl('/setting/tasks/status');
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
        });

  }

  fetchBySearch() {
    this.api.get('/task-statuses?s=' + this.searched).subscribe(res => {
      this.statuses = res.data;
    });
  }
}
