import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormHelper} from '../../../../../helpers/form-helper';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../../../../../services/api.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-edit-priority',
  templateUrl: './edit-priority.component.html',
  styleUrls: ['./edit-priority.component.css']
})
export class EditPriorityComponent implements OnInit {
  PriForm: FormGroup;
  submitted = true;
  editId = null;
  searched = '';
  jobTypes: any;
  public error = null;

  constructor(private fb: FormBuilder, private formHelper: FormHelper, private toastr: ToastrService,
              private activatedRoute: ActivatedRoute, private api: ApiService, private router: Router) {
  }

  ngOnInit() {
    this.createForm();
    this.activatedRoute.params.subscribe(params => {
      this.editId = params['id'];
      this.api.get('/priorities/' + params['id']).subscribe(res => {
        Object.keys(this.PriForm.controls).forEach(key => {
          this.PriForm.controls[key].setValue(res.data[key]);
        });
      });
    });
    this.fetchBySearch();
  }

  createForm() {
    this.PriForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;
    this.formHelper.validateAllFormFields(this.PriForm);
    if (this.PriForm.invalid) {
      console.log('invalid');
      return;
    }
    this.api.put('/priorities/' + this.editId, this.PriForm.value).subscribe(res => {
          this.toastr.success('Priority Updated');
          this.router.navigateByUrl('/setting/tasks/priority');
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
    this.api.get('/priorities?s=' + this.searched).subscribe(res => {
      this.jobTypes = res.data;
    });
  }
}
