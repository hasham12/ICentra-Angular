import { FormHelper } from './../../../../../helpers/form-helper';
import { ToastrService } from 'ngx-toastr';
import { Group } from 'src/app/models/group.model';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.css']
})
export class EditGroupComponent implements OnInit {
  constructor(
    private Api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private formHelper: FormHelper
  ) {}
  GroupForm: FormGroup;
  public Group: Group;
  public sub: any;
  public error = null;
  public group_id: string;
  public logoUrl: any;
  public logoFiles = null;
  public GroupFormData = new FormData();
  ngOnInit() {
    this.GroupForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email, Validators.required]),
      mobile: new FormControl('', [Validators.required]),
      position: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      notes: new FormControl(''),
      logo: new FormControl('')
    });

    this.sub = this.route.params.subscribe(params => {
      this.group_id = params['id'];
      this.getGroup(this.group_id);
    });

     
  }

  getGroup(id = null) {
    if (id) {
      this.Api.get('/groups/' + id).subscribe(data => {
        this.Group = data.data;
        this.GroupForm.patchValue(this.Group);
        this.logoUrl = this.Group.logo;
      },
      error => {
        this.error  = error;
      });
    }
  }
  updateGroup() {
    this.formHelper.validateAllFormFields(this.GroupForm);
    if (this.GroupForm.invalid && this.group_id) {
      console.log('invalid form' + this.GroupForm.invalid);
      return false;
    }
    this.preparForm();
    this.Api.post('/groups/' + this.group_id, this.GroupFormData).subscribe(
      data => {
        this.toastr.success('Group has been updated.');
        this.router.navigateByUrl('/setting/list/groups');
      },
      error => {
        this.error = Array.of(error.error.errors);
        this.toastr.error('Somthing wrong with the form. Please check and try again.');
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
    this.GroupForm.get('logo').patchValue(event.target.files[0]);
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
    this.GroupFormData.set('logo', this.logoFiles);
  }
}
