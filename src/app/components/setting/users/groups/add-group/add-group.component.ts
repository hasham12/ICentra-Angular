import { FormHelper } from './../../../../../helpers/form-helper';
import { ToastrService } from 'ngx-toastr';
import { Group } from 'src/app/models/group.model';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.css']
})
export class AddGroupComponent implements OnInit {
  constructor(
    private Api: ApiService,
    private router: Router,
    private toastr: ToastrService,
    private formHelper: FormHelper
  ) {}
  GroupForm: FormGroup;
  public Group: Group;
  public submitted = false;
  public error = null;
  public logoUrl: any;
  public logoFiles = null;
  public GroupFormData = new FormData();
  ngOnInit() {
    this.GroupForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      logo: new FormControl(),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      mobile: new FormControl('', [Validators.required]),
      position: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      notes: new FormControl('')
    });

  }

  addGroup() {
    this.formHelper.validateAllFormFields(this.GroupForm);
    if (this.GroupForm.invalid) {
      return false;
    }
    this.preparForm();
    this.Api.post('/groups', this.GroupFormData).subscribe(
      data => {
        this.toastr.success('Group has been created.');
        this.router.navigateByUrl('/setting/list/groups');
      },
      error => {
        this.error = Array.of(error.error.errors);
        if (error.message && error.status_code !== 500) {
          this.toastr.error(this.error, error.error.message);
        } else {
          this.toastr.error('Something wrong with the form. Please check and try again.');
        }
        console.log('Group error is ' + this.error);
      }
      // this.response = data;
    );
  }
  public delete() {
    this.logoUrl = null;
  }
  onSelectFile(event) {
    this.logoFiles = '';
    console.log(this.logoFiles);
    this.logoFiles = event.target.files[0];
    if (event.target.files && event.target.files.length) {
      const fileReader: FileReader = new FileReader();
      fileReader.readAsDataURL(event.target.files[0]);
      fileReader.onload = (event: Event) => {
        this.logoUrl = fileReader.result;
      };
    }
}

preparForm(){
  this.GroupFormData = new FormData();
  Object.keys(this.GroupForm.controls).forEach(key => {
    let a = this.GroupForm.get(key).value;
    this.GroupFormData.append(key, this.GroupForm.get(key).value);
  });
  if(this.logoFiles != null) {
    this.GroupFormData.set('logo', this.logoFiles);
  }else{
    this.GroupFormData.delete('logo');
  }
}
}
