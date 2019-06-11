import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormHelper} from '../../../../../helpers/form-helper';
import {ApiService} from '../../../../../services/api.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-add-priority',
  templateUrl: './add-priority.component.html',
  styleUrls: ['./add-priority.component.css']
})
export class AddPriorityComponent implements OnInit {
  PriForm: FormGroup;
  submitted = true;
  searched = '';
  jobTypes: any;
  public error = null;
  constructor(private fb: FormBuilder, private formHelper: FormHelper, private toastr: ToastrService,
              private api: ApiService, private router: Router) {
  }

  ngOnInit() {
    this.createForm();
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
    this.api.post('/priorities', this.PriForm.value).subscribe(res => {
          this.toastr.success('Priority Created');
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
