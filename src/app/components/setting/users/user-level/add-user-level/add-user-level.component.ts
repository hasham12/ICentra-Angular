import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../../services/api.service';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormHelper} from '../../../../../helpers/form-helper';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-user-level',
  templateUrl: './add-user-level.component.html',
  styleUrls: ['./add-user-level.component.css']
})
export class AddUserLevelComponent implements OnInit {
  levelForm: FormGroup;
  search: { [k: string]: any } = {};
  realLevels: any;
  searched = '';
  submitted = false;
  public error = null;

  constructor(private fb: FormBuilder, private formHelper: FormHelper, private toastr: ToastrService,
              private api: ApiService, private router: Router) {
  }

  ngOnInit() {
    this.createForm();
    this.fetchBySearch();
  }

  createForm() {
    this.levelForm = this.fb.group({
      title: ['', Validators.required],
      discount: ['', Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;
    this.formHelper.validateAllFormFields(this.levelForm);
    if (this.levelForm.invalid) {
      console.log('invalid');
      return;
    }
    this.api.post('/user-levels', this.levelForm.value).subscribe(res => {
          this.toastr.success('User Level Created');
          this.router.navigateByUrl('/setting/list/users/level');
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
    this.api.get('/user-levels?s=' + this.searched).subscribe(res => {
      this.realLevels = res.data;
    });
  }

  filterItem(key, value) {
    this.search[key] = value;
    this.api.get('/user-levels?s=' + this.searched).subscribe(res => {
      this.realLevels = res.data;
    });
  }

}
