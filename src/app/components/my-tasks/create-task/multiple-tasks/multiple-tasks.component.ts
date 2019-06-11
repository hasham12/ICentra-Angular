import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FormHelper} from '../../../../helpers/form-helper';
import {TaskService} from '../../../../services/task/task.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {ApiService} from '../../../../services/api.service';

@Component({
    selector: 'app-multiple-tasks',
    templateUrl: './multiple-tasks.component.html',
    styleUrls: ['./multiple-tasks.component.css']
})
export class MultipleTasksComponent implements OnInit {
    createTaskForm: FormGroup;
    submitted: boolean;
    taskStatuses: any;
    taskSets: any;
    properties: any;
    jobTypes: any;
    taskCategories: any;
    propertiesList: any;
    originalAssigns: any;
    assigns: any;
    addressBox = [];
    priorities: any;
    subTask: any;
    addressSelection = '';
    editableRow: any;
    editableIndex = -1;

    error = null;
    constructor(private fb: FormBuilder, private formHelper: FormHelper, private task: TaskService, private router: Router,
                private toastr: ToastrService, private api: ApiService) {
        this.createForm();
    }

    ngOnInit() {
        this.submitted = false;
        this.task.getSets().subscribe(res => {
            this.taskSets = res.data;
        });
        this.api.get('/users-by-offices').subscribe(res => {
            this.assigns = res.data.map((i) => { i.full_name = i.first_name + ' ' + i.last_name; return i; });
            this.originalAssigns = res.data.map((i) => { i.full_name = i.first_name + ' ' + i.last_name; return i; });
        });
        this.task.getStatuses().subscribe(res => {
            this.taskStatuses = res.data;
        });
        this.task.getTypes().subscribe(res => {
            this.jobTypes = res.data;
        });
        this.task.getCategories().subscribe(res => {
            this.taskCategories = res.data;
        });
        this.task.getProperties().subscribe(res => {
            this.properties = res.data;
        });
        this.task.getPriorities().subscribe(res => {
            this.priorities = res.data;
        });
    }

    createForm() {
        this.createTaskForm = this.fb.group({
            is_later: [0],
            task_type_id: ['2', Validators.required],
            start_date: ['', Validators.required],
            task_set_id: ['', Validators.required],
            sub_task: [[]]
        });
    }


    dateChanged() {
        this.getMarketSubTask();
    }

    showMarketingTasks(event) {
        this.createTaskForm.controls['task_set_id'].setValue(event.id);
        this.getMarketSubTask();
    }

    getMarketSubTask() {
        const controlled = this.createTaskForm.controls;
        if (controlled['start_date'].value !== '' && controlled['task_set_id'].value !== '') {
            this.task.marketingTasksByTaskSet(controlled['task_set_id'].value, controlled['start_date'].value).subscribe(data => {
                this.subTask = data;
                console.log(this.subTask);
            });
        }
    }

    onSubmit(state) {

        if (state === 'later') {
            this.createTaskForm.controls['is_later'].setValue(1);
        } else {
            this.createTaskForm.controls['is_later'].setValue(0);
        }
        this.createTaskForm.controls['sub_task'].setValue(this.subTask);
        this.submitted = true;
        this.formHelper.validateAllFormFields(this.createTaskForm);
        if (this.createTaskForm.invalid) {
            console.log('invalid');
            return;
        }
        this.api.post('/tasks-market', this.createTaskForm.value).subscribe(res => {
            this.router.navigateByUrl('/tasks/my-tasks');
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

    getNameById(typeId, header) {
        if (header === 'type') {
            return this.jobTypes.filter(x => x.id === typeId)[0].name;
        } else if (header === 'status') {
            return this.taskStatuses.filter(x => x.id === typeId)[0].name;
        } else if (header === 'category') {
            return this.taskCategories.filter(x => x.id === typeId)[0].name;
        } else if (header === 'priority') {
            return this.priorities.filter(x => x.id === typeId)[0].name;
        } else if (header === 'pobox') {
            const finder = this.addressBox.filter(x => x.id === typeId);
            if (finder === undefined || finder[0] === undefined || this.addressBox.length === 0) {
                return;
            } else {
                return finder[0].address;
            }
        }
        return;
    }

    editNextBtn(index) {
        if (typeof this.subTask[index + 1] === 'undefined') {
            this.editorOpen(this.subTask[0]);
        } else {
            this.editorOpen(this.subTask[index + 1]);
        }
    }

    editorOpen(row) {
        this.editableIndex = this.subTask.indexOf(row);
        this.editableRow = row;
    }

    searchedProperties(e) {
        if (e.term !== '') {
            this.api.post('/rex/listings_autocomplete', {search_string: e.term, limit: 20}).subscribe(res => {
                this.propertiesList = res.result;
            });
        }
    }

    propertySelection(row) {
        this.addressSelection = row.address;
        this.api.post('/property-address', row).subscribe(res => {
            this.editableRow.property_id = row._id;
            this.addressBox.push({id: this.editableRow.property_id, address: row.address});
        });
    }
    changeQtyBox(action) {
        const filed = this.editableRow.quantity;
        if (action === 'plus') {
            this.editableRow.quantity = filed + 1;
        } else {
            if (filed === 0) {
                this.editableRow.quantity = 1;
            }
            this.editableRow.quantity = this.editableRow.quantity + 1;
        }
        this.getBill();
    }

    getBill() {
        const form = this.createTaskForm;
        if (this.editableRow.quantity < 0) {
            this.editableRow.quantity = this.editableRow.quantity * -1;
        }
        const myFilter = this.taskCategories.filter(cat => cat.id === this.editableRow.task_category_id);
        if (myFilter[0].printingCosts === 0) {
            this.toastr.error('Please contact your office for printing rates');
        } else {
            this.task.bill(this.editableRow.printing_type_id, this.editableRow.task_category_id, this.editableRow.quantity).subscribe(res => {
                this.editableRow.bill = res * this.editableRow.quantity;
                console.log(this.editableRow);
            });
        }
    }


}
