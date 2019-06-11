import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormHelper} from '../../../../../helpers/form-helper';
import {ApiService} from '../../../../../services/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../../../../../services/auth/auth.service';

@Component({
  selector: 'app-edit-task-category',
  templateUrl: './edit-task-category.component.html',
  styleUrls: ['./edit-task-category.component.css']
})
export class EditTaskCategoryComponent implements OnInit {
  createTaskCatForm: FormGroup;
  submitted = true;
  searched = '';
  editId = null;
  categories: any;
  SearchedCategories: any;
  offices: any;
  public error: any;
  thisUser: any;

  constructor(private fb: FormBuilder, private formHelper: FormHelper, private toastr: ToastrService, private Auth: AuthService,
              private activatedRoute: ActivatedRoute, private api: ApiService, private router: Router) {
  }

  ngOnInit() {
    this.createForm();
    this.Auth.UserSub.subscribe(user => {
      this.thisUser = user;
      this.offices = this.thisUser.offices.data;
    });
    this.api.get('/task-categories').subscribe(res => {
      this.SearchedCategories = res.data;
    });
    this.activatedRoute.params.subscribe(params => {
      this.editId = params['id'];
      this.api.get('/task-categories/' + params['id']).subscribe(res => {
        Object.keys(this.createTaskCatForm.controls).forEach(key => {
          this.createTaskCatForm.controls[key].setValue(res.data[key]);
        });
      });
    });
    this.fetchBySearch();
  }

  createForm() {
    this.createTaskCatForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      office_id: [null, Validators.required],
      _method: ['PUT'],
    });
  }

  onSubmit() {
    this.submitted = true;
    this.formHelper.validateAllFormFields(this.createTaskCatForm);
    if (this.createTaskCatForm.invalid) {
      console.log('invalid');
      return;
    }
    this.api.put('/task-categories/' + this.editId, this.createTaskCatForm.value).subscribe(res => {
          this.toastr.success('Category has been Created');
          this.router.navigateByUrl('/setting/tasks/category');
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
    this.api.get('/task-categories?s=' + this.searched).subscribe(res => {
      this.SearchedCategories = res.data;
    });
  }
}
