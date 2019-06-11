import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import * as $ from 'jquery';
import {FormHelper} from 'src/app/helpers/form-helper';
import {TaskService} from '../../../services/task/task.service';
import {FileUploader} from 'ng2-file-upload';
import {ApiService} from '../../../services/api.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-create-task',
    templateUrl: './create-task.component.html',
    styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {

    rexValid = true;
    createTaskForm: FormGroup;
    submitted: boolean;
    jobTypes: any;
    taskStatuses: any;
    categories: any;
    properties: any;
    priorities: any;
    assigns: any;
    propertiesList: any;
    originalAssigns: any;
    bill: any;
    file_name: any;
    uploadedFile: any;
    today = new Date();
    submitDisable = false;
    public GroupFormData = new FormData();

    error = null;
    constructor(private fb: FormBuilder, private formHelper: FormHelper, private task: TaskService, private router: Router,
                private toastr: ToastrService, private api: ApiService, private http: HttpClient) {
        this.createForm();
    }

    ngOnInit() {

        // this.api.post('/rex/verify', {}).subscribe(res => {
        //     if (res.hasOwnProperty('verify')) {
        //         this.rexValid = true;
        //     } else {
        //         this.rexValid = false;
        //     }
        // });
        $('.custom-checkbox input.yes').click(function () {
            $('.printing-yes-show ').removeClass('d-none');
        });
        $('.custom-checkbox input.no').click(function () {
            $('.printing-yes-show ').addClass('d-none');
        });
        this.submitted = false;
        this.api.post('/rex/listings_autocomplete', {search_string: '129 ', limit: 20}).subscribe(res => {
            this.propertiesList = res.data;
        });
        this.api.get('/users-by-offices').subscribe(res => {
            this.assigns = res.data.map((i) => { i.full_name = i.first_name + ' ' + i.last_name; return i; });
            this.originalAssigns = res.data.map((i) => { i.full_name = i.first_name + ' ' + i.last_name; return i; });
        });
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
        this.printingTypeSetting('no');
        this.QuantityCheck('no');
        this.bill = 0;


    }

    createForm() {
        this.createTaskForm = this.fb.group({
            is_later: [0],
            task_type_id: ['1', Validators.required],
            title: ['', Validators.required],
            assignedUsers: [[], Validators.required],
            job_type_id: [, Validators.required],
            start_date: ['', Validators.required],
            due_date: ['', Validators.required],
            task_status_id: [, Validators.required],
            property_id: [],
            task_category_id: [],
            priority_id: [, Validators.required],
            description: [''],
            isPrinting: [''],
            isRecurring: [false],
            printing_type_id: ['', Validators.required],
            quantity: [, Validators.required],
            isChecked: [true, Validators.pattern('true')],
        });
    }

    deleteUploadFile() {
        delete this.uploadedFile;
    }

    onSelectFile(event) {
        console.log(event);
        this.uploadedFile = event.target.files[0];
        if (event.target.files && event.target.files.length) {
            const fileReader: FileReader = new FileReader();
            fileReader.readAsDataURL(event.target.files[0]);
            fileReader.onload = (event: Event) => {
                this.file_name = fileReader.result;
            };
        }
        console.log(this.uploadedFile.name);
    }

    onSubmit(state) {
        if (state === 'later') {
            this.createTaskForm.controls['is_later'].setValue(1);
            this.drafting();
        } else {
            this.createTaskForm.controls['is_later'].setValue(0);
            this.submitted = true;
            this.formHelper.validateAllFormFields(this.createTaskForm);
            if (this.createTaskForm.invalid) {
                return;
            }
            this.submitDisable = true;
            this.GroupFormData = new FormData();
            Object.keys(this.createTaskForm.controls).forEach(key => {
                let a = this.createTaskForm.get(key).value;
                this.GroupFormData.append(key, this.createTaskForm.get(key).value);
            });
            if (this.uploadedFile && this.uploadedFile.length > 0) {
                let ids = "";
                this.uploadedFile.forEach(f => {
                    ids += f.file_id + ',';
                });
                this.GroupFormData.set('fileUpload', ids);
            }

            this.api.post('/tasks', this.GroupFormData).subscribe(res => {
                this.submitDisable = false;
                this.toastr.success('Task Created');
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
    }

    drafting() {
        console.log(this.createTaskForm.controls);
        this.GroupFormData = new FormData();
        Object.keys(this.createTaskForm.controls).forEach(key => {
            let a = this.createTaskForm.get(key).value;
            this.GroupFormData.append(key, this.createTaskForm.get(key).value);
        });
        this.GroupFormData.set('fileUpload', this.uploadedFile);
        this.api.post('/tasks', this.GroupFormData).subscribe(res => {
            this.toastr.success('Task Drafted');
            // this.router.navigateByUrl('/tasks/my-tasks');
        });
    }

    printingTypeSetting(val) {
        if (val === 'yes') {
            this.createTaskForm.controls['printing_type_id'].enable();
        } else {
            this.createTaskForm.controls['printing_type_id'].disable();
        }
    }

    QuantityCheck(val) {
        if (val === 'yes') {
            this.createTaskForm.controls['printing_type_id'].setValue(1);
            this.createTaskForm.controls['quantity'].enable();
            this.createTaskForm.controls['isChecked'].enable();
        } else {
            this.createTaskForm.controls['printing_type_id'].setValue(2);
            this.createTaskForm.controls['quantity'].disable();
            this.createTaskForm.controls['quantity'].setValue(0);
            this.createTaskForm.controls['isChecked'].disable();
            this.bill = 0;
        }
    }

    getBill() {
        const form = this.createTaskForm;
        if (form.controls['quantity'].value < 0) {
            form.controls['quantity'].setValue(form.controls['quantity'].value * -1);
        }
        const myFilter = this.categories.filter(cat => cat.id === form.controls['task_category_id'].value);
        if (myFilter[0].printingCosts === 0) {
            this.toastr.error('Please contact your office for printing rates');
        } else {
            this.task.bill(form.controls['printing_type_id'].value, form.controls['task_category_id'].value, form.controls['quantity'].value).subscribe(res => {
                if (res.discount_percent > 0) {
                    const orgBill = res.per_print * form.controls['quantity'].value;
                    this.bill = orgBill - (orgBill * res.discount_percent / 100 );
                } else {
                    this.bill = res.per_print * form.controls['quantity'].value;
                }
                form.controls['isChecked'].setValue(false);
            });
        }
    }

    searchedProperties(e) {
        if (e.term !== '') {
            this.api.post('/rex/listings_autocomplete', {search_string: e.term, limit: 20}).subscribe(res => {
                this.propertiesList = res.result;
                console.log(this.propertiesList);
            });
        }
    }

    changeQtyBox(action) {
        const filed = this.createTaskForm.controls['quantity'];
        if (action === 'plus') {
            filed.setValue(filed.value + 1);
        } else {
            if (filed.value === 0) {
                filed.setValue(1);
            }
            filed.setValue(filed.value - 1);
        }
        this.getBill();
    }

    propertySelection(row) {
        this.api.post('/property-address', row).subscribe(res => {
        });
    }

    fileReceivedForTask(e) {
        this.uploadedFile = e;
    }

    selectAllAssignee() {
        let assignedUsers = [];
        this.originalAssigns.forEach(as => {
            assignedUsers.push(as.id);
        });
        this.createTaskForm.controls['assignedUsers'].setValue(assignedUsers);
    }
}


