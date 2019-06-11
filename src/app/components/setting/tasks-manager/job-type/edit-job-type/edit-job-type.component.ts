import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormHelper} from '../../../../../helpers/form-helper';
import {ApiService} from '../../../../../services/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-edit-job-type',
    templateUrl: './edit-job-type.component.html',
    styleUrls: ['./edit-job-type.component.css']
})
export class EditJobTypeComponent implements OnInit {
    createJobTypeForm: FormGroup;
    submitted = true;
    editId = null;
    public error = null;
    searched = '';
    jobTypes: any;

    constructor(private fb: FormBuilder, private formHelper: FormHelper, private toastr: ToastrService,
                private activatedRoute: ActivatedRoute, private api: ApiService, private router: Router) {
    }

    ngOnInit() {
        this.createForm();
        this.activatedRoute.params.subscribe(params => {
            this.editId = params['id'];
            this.api.get('/job-types/' + params['id']).subscribe(res => {
                Object.keys(this.createJobTypeForm.controls).forEach(key => {
                    this.createJobTypeForm.controls[key].setValue(res.data[key]);
                });
            });
        });
        this.fetchBySearch();
    }

    fetchBySearch() {
        this.api.get('/job-types?s=' + this.searched).subscribe(res => {
            this.jobTypes = res.data;
        });
    }

    createForm() {
        this.createJobTypeForm = this.fb.group({
            name: ['', Validators.required],
            color: ['', Validators.required],
            description: ['', Validators.required],
            _method:['PUT']
        });
    }

    onSubmit() {
        this.submitted = true;
        this.formHelper.validateAllFormFields(this.createJobTypeForm);
        if (this.createJobTypeForm.invalid) {
            console.log('invalid');
            return;
        }
        this.api.put('/job-types/' + this.editId, this.createJobTypeForm.value).subscribe(res => {
            this.toastr.success('job Type has been Updated');
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

    
}
