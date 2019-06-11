import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FormHelper} from '../../../helpers/form-helper';
import {TaskService} from '../../../services/task/task.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {ApiService} from '../../../services/api.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-edit-task-model',
  templateUrl: './edit-task-model.component.html',
  styleUrls: ['./edit-task-model.component.css']
})
export class EditTaskModelComponent implements OnInit {
  @Output()
  modelDone = new EventEmitter<string>();

  rexValid = true;
  createTaskForm: FormGroup;
  submitted: boolean;
  jobTypes: any;
  assignedUsers = [];
  assigns: any;
  propertiesList: any;
  originalAssigns: any;
  taskStatuses: any;
  categories: any;
  properties: any;
  priorities: any;
  bill: any;
  file_name: any;
  uploadedFile: any;
  editId = null;
  comments = '';
  commentList: any;
  followTask = false;
  public GroupFormData = new FormData();
  @Input() taskId: number;

  constructor(private fb: FormBuilder, private formHelper: FormHelper, private task: TaskService, private router: Router,
              private activatedRoute: ActivatedRoute, private toastr: ToastrService, private api: ApiService) {
    this.createForm();
  }

  ngOnChanges() {
    this.RunThis();
  }

  ngOnInit() {
    this.RunThis();
  }

  RunThis() {
    $('.se-pre-con').fadeIn('slow');
    $('.custom-checkbox input.yes').click(function () {
      $('.printing-yes-show ').removeClass('d-none');
    });
    $('.custom-checkbox input.no').click(function () {
      $('.printing-yes-show ').addClass('d-none');
    });
    this.submitted = false;
    this.api.get('/users-by-offices').subscribe(res => {
      this.assigns = res.data.map((i) => {
        i.full_name = i.first_name + ' ' + i.last_name;
        return i;
      });
      this.originalAssigns = res.data.map((i) => {
        i.full_name = i.first_name + ' ' + i.last_name;
        return i;
      });
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
    if (this.taskId) {
      this.editId = this.taskId;
      this.task.getTaskById(this.taskId).subscribe(res => {
        Object.keys(this.createTaskForm.controls).forEach(key => {
          this.createTaskForm.controls[key].setValue(res.data[key] === 'null' ? '' : res.data[key]);
        });
        if (res.data.property_id !== null) {
          this.api.post('/rex/listings_autocomplete', {search_string: res.data.property.data.address, limit: 20})
              .subscribe(resp => {
                this.propertiesList = resp.result;
                this.createTaskForm.controls['property_id'].setValue(res.data.property.data.property_id.toString());
              });
        }
        if (res.data.printing_type_id !== null) {
          this.createTaskForm.controls['isPrinting'].setValue('yes');
          $('.printing-yes-show ').removeClass('d-none');
          this.printingTypeSetting('yes');
          if (this.createTaskForm.controls['printing_type_id'].value === 1) {
            this.createTaskForm.controls['printing_type_id'].setValue(1);
            this.QuantityCheck('yes');
            if (res.data.billings.data.length > 0) {
              this.createTaskForm.controls['quantity'].setValue(res.data.billings.data[0].quantity);
            }
            this.getBill();
          }
        }
        if (res.data.attachments.length > 0 && res.data.attachments.data[0].name) {
          this.uploadedFile = {
            name: res.data.attachments.data[0].name
          };
        }
        if (res.data.assigns.data.length > 0) {
          this.assignedUsers = [];
          res.data.assigns.data.forEach(asgn => {
            this.assignedUsers.push(asgn.user_id);
          });
          this.createTaskForm.controls['assignedUsers'].setValue(this.assignedUsers);
          $('.se-pre-con').fadeOut('slow');
        }
      });
      this.loadComments();
    }

    this.currentTaskFollowStatus();
  }

  currentTaskFollowStatus() {
    this.api.get('/task-follows-status/' + this.editId).subscribe(res => {
      this.followTask = res.follow;
    });
  }

  createForm() {
    this.createTaskForm = this.fb.group({
      is_later: [],
      task_type_id: ['1', Validators.required],
      title: ['', Validators.required],
      assignedUsers: [[]],
      job_type_id: ['', Validators.required],
      start_date: ['', Validators.required],
      due_date: ['', Validators.required],
      task_status_id: ['', Validators.required],
      property_id: [''],
      task_category_id: ['', Validators.required],
      priority_id: ['', Validators.required],
      description: [''],
      isPrinting: ['', Validators.required],
      printing_type_id: ['', Validators.required],
      quantity: [, Validators.required],
      isChecked: [true, Validators.pattern('true')],
      fileUpload: new FormControl()
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
    } else {
      this.createTaskForm.controls['is_later'].setValue(0);
    }
    this.submitted = true;
    this.formHelper.validateAllFormFields(this.createTaskForm);
    if (this.createTaskForm.invalid) {
      console.log('invalid');
      return;
    }
    this.GroupFormData = new FormData();
    Object.keys(this.createTaskForm.controls).forEach(key => {
      let a = this.createTaskForm.get(key).value;
      this.GroupFormData.append(key, this.createTaskForm.get(key).value);
    });
    this.GroupFormData.set('fileUpload', this.uploadedFile);
    this.GroupFormData.set('_method', 'PUt');

    this.api.post('/tasks/' + this.editId, this.GroupFormData).subscribe(res => {
      this.modelDone.emit('Task Edited');
      // this.router.navigateByUrl('/tasks/board');
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

  loadComments() {
    this.api.get('/comments/by-tasks/' + this.editId + '?include=user').subscribe(res => {
      this.commentList = res.data;
    });
  }

  saveComments() {
    this.api.post('/comments', {comments: this.comments, task_id: this.editId}).subscribe(res => {
      this.toastr.info('Comments Published');
      this.comments = '';
      this.loadComments();
    });
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
    if (filed.value === NaN || filed.value === undefined) {
      filed.setValue(0);
    }
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

  taskFollowBtn(val) {
    this.api.post('/task-follows', {follow: val, task_id: this.editId}).subscribe(res => {
      this.toastr.success(res.message);
      this.currentTaskFollowStatus();
    });
  }

  cancelPopup() {
    this.modelDone.emit('close this');
  }
}
