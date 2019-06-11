import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../../../services/api.service';
import {Router} from '@angular/router';
import {FormHelper} from '../../../../../helpers/form-helper';

@Component({
    selector: 'app-add-printing',
    templateUrl: './add-printing.component.html',
    styleUrls: ['./add-printing.component.css']
})
export class AddPrintingComponent implements OnInit {

    cats: any;
    printForm: FormGroup;

    constructor(private api: ApiService, private fb: FormBuilder, private router: Router, private formHelper: FormHelper) {
    }

    ngOnInit() {
        this.api.get('/task-categories').subscribe(res => {
            this.cats = res.data;
        });

        this.printForm = this.fb.group({
            amount_per_print: ['', Validators.required],
            task_category_id: ['', Validators.required],
            printing_type_id: [1, Validators.required]
        });
    }

    onSubmit() {
        this.formHelper.validateAllFormFields(this.printForm);
        if (this.printForm.invalid) {
            console.log('invalid');
            return;
        }
        this.api.post('/printing-costs', this.printForm.value).subscribe(res => {
            this.router.navigateByUrl('/setting/tasks/printing');
        });

    }
}
