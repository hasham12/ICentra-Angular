import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormHelper} from '../../../../../helpers/form-helper';
import {ApiService} from '../../../../../services/api.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-add-job-type',
    templateUrl: './add-job-type.component.html',
    styleUrls: ['./add-job-type.component.css']
})
export class AddJobTypeComponent implements OnInit {
    createJobTypeForm: FormGroup;
    submitted = true;
    searched = '';
    jobTypes: any;
    public error = null;

    constructor(private fb: FormBuilder, private formHelper: FormHelper, private api: ApiService, private router: Router,
                private toastr: ToastrService) {
    }

    ngOnInit() {
        this.createForm();
        this.fetchBySearch();
    }

    createForm() {
        this.createJobTypeForm = this.fb.group({
            name: ['', Validators.required],
            color: ['', Validators.required],
            description: ['', Validators.required],
        });
    }

    onSubmit() {
        this.submitted = true;
        this.formHelper.validateAllFormFields(this.createJobTypeForm);
        if (this.createJobTypeForm.invalid) {
            console.log('invalid');
            return;
        }
        this.api.post('/job-types', this.createJobTypeForm.value).subscribe(res => {
                this.toastr.success('job Type has been Created');
                this.router.navigateByUrl('/setting/tasks/job-type');
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
        this.api.get('/job-types?s=' + this.searched).subscribe(res => {
            this.jobTypes = res.data;
        });
    }
}
