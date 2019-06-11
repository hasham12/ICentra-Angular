import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormHelper} from '../../../../../helpers/form-helper';
import {ApiService} from '../../../../../services/api.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../../../../../services/auth/auth.service';

@Component({
    selector: 'app-add-task-category',
    templateUrl: './add-task-category.component.html',
    styleUrls: ['./add-task-category.component.css']
})
export class AddTaskCategoryComponent implements OnInit {
    createTaskCatForm: FormGroup;
    submitted = true;
    searched = '';
    categories: any;
    SearchedCategories: any;
    offices: any;
    thisUser: any;
    public error: any;

    constructor(private fb: FormBuilder, private formHelper: FormHelper, private api: ApiService, private Auth: AuthService,
                private router: Router, private toastr: ToastrService) {
    }

    ngOnInit() {
        this.Auth.UserSub.subscribe(user => {
            this.thisUser = user;
            this.offices = this.thisUser.offices.data;
        });
        this.createForm();
        this.api.get('/task-categories').subscribe(res => {
            this.SearchedCategories = res.data;
        });
    }

    createForm() {
        this.createTaskCatForm = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            office_id: [null, Validators.required]
        });
    }

    onSubmit() {
        this.submitted = true;
        this.formHelper.validateAllFormFields(this.createTaskCatForm);
        if (this.createTaskCatForm.invalid) {
            console.log('invalid');
            return;
        }
        this.api.post('/task-categories', this.createTaskCatForm.value).subscribe(res => {
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
