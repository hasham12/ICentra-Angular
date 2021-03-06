import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TaskService} from '../../../../../services/task/task.service';
import {FormHelper} from '../../../../../helpers/form-helper';
import {ApiService} from '../../../../../services/api.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-add-marketing',
    templateUrl: './add-marketing.component.html',
    styleUrls: ['./add-marketing.component.css']
})
export class AddMarketingComponent implements OnInit {

    MarketForm: FormGroup;
    setName: string;
    subTaskList = [];
    jobTypes: any;
    taskStatuses: any;
    categories: any;
    properties: any;
    priorities: any;
    submitted = false;
    editMode = -1;
    public error = null;

    constructor(private fb: FormBuilder, private task: TaskService, private formHelper: FormHelper, private toastr: ToastrService,
                private api: ApiService, private router: Router) {
    }

    ngOnInit() {
        this.createForm();
        this.task.getTypes().subscribe(res => {
            this.jobTypes = res.data;
        });
        this.task.getStatuses().subscribe(res => {
            this.taskStatuses = res.data;
        });
        this.task.getProperties().subscribe(res => {
            this.properties = res.data;
        });
        this.task.getCategories().subscribe(res => {
            this.categories = res.data;
        });
        this.task.getPriorities().subscribe(res => {
            this.priorities = res.data;
        });
        this.setName = '';
    }

    createForm() {
        this.MarketForm = this.fb.group({
            title: ['', Validators.required],
            job_type_id: [null, Validators.required],
            task_category_id: [null, Validators.required],
            task_status_id: [null, Validators.required],
            priority_id: [null, Validators.required],
            duration: [1, Validators.required],
            is_printing: [false],
            is_commenting: [false],
            is_assign: [false],
            is_property: [false],
        });
    }

    onSubmit() {
        this.submitted = true;
        if (this.MarketForm.controls['is_printing'].value === null) { console.log('print issue');
            this.MarketForm.controls['is_printing'].setValue(false);
        }
        if (this.MarketForm.controls['is_assign'].value === null) { console.log('print issue');
            this.MarketForm.controls['is_assign'].setValue(false);
        }
        if (this.MarketForm.controls['is_property'].value === null) { console.log('prop issue');
            this.MarketForm.controls['is_property'].setValue(false);
        }
        if (this.MarketForm.controls['is_commenting'].value === null) { console.log('commen issue');
            this.MarketForm.controls['is_commenting'].setValue(false);
        }
        this.formHelper.validateAllFormFields(this.MarketForm);
        if (this.MarketForm.invalid) {
            console.log('invalid');
            return;
        }
        if (this.editMode === -1) {
            this.subTaskList.push(this.MarketForm.value);
        } else {
            this.subTaskList[this.editMode] = this.MarketForm.value;
            this.editMode = -1;
        }
        this.MarketForm.reset();
    }

    getNameById(typeId, header) {
        if (header === 'type') {
            return this.jobTypes.filter(x => x.id === typeId)[0].name;
        } else if (header === 'status') {
            return this.taskStatuses.filter(x => x.id === typeId)[0].name;
        } else if (header === 'category') {
            return this.categories.filter(x => x.id === typeId)[0].name;
        } else if (header === 'priority') {
            return this.priorities.filter(x => x.id === typeId)[0].name;
        }
        return;
    }

    submitToDB() {
        this.api.post('/task-sets', {marketing_tasks: this.subTaskList, setName: this.setName}).subscribe(res => {
            this.toastr.success('Market Task Created');
            this.router.navigateByUrl('/setting/tasks/marketing');
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

    deleteThisSubTask(sub) {
        this.subTaskList.splice(this.subTaskList.indexOf(sub), 1);
    }

    enableEditMode(sub) {
        Object.keys(this.MarketForm.controls).forEach(key => {
            this.MarketForm.controls[key].setValue(sub[key]);
        });

        this.editMode = this.subTaskList.indexOf(sub);
    }
    changeQtyBox(action) {
        const filed = this.MarketForm.controls['duration'];
        if (action === 'plus') {
            filed.setValue(filed.value + 1);
        } else {
            if (filed.value === 1) {
                filed.setValue(2);
            }
            filed.setValue(filed.value - 1);
        }
    }


}
