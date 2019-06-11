import { FormHelper } from 'src/app/helpers/form-helper';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-office',
  templateUrl: './add-office.component.html',
  styleUrls: ['./add-office.component.css']
})
export class AddOfficeComponent implements OnInit {
  constructor(
    private Api: ApiService,
    private router: Router,
    private toastr: ToastrService,
    private formHelper: FormHelper
  ) {}
  OfficeFrom: FormGroup;
  public Groups: any;
  public submitted = false;
  public error = null;
  public groups: any[];
  ngOnInit() {
    this.OfficeFrom = new FormGroup({
      name: new FormControl('', [Validators.required]),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email, Validators.required]),
      position: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [Validators.required]),
      website: new FormControl('', [Validators.required]),
      group_id: new FormControl(null, [Validators.required]),
      address_line_1: new FormControl('', [Validators.required]),
      address_line_2: new FormControl(''),
      country: new FormControl('Australia', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      suburb: new FormControl('', [Validators.required]),
      postcode: new FormControl('', [Validators.required]),
      notes: new FormControl()
    });

    this.getGroups();

  }

  addOffice() {
    this.formHelper.validateAllFormFields(this.OfficeFrom);
    if (this.OfficeFrom.invalid) {
      return false;
    }
    this.Api.post('/offices', this.OfficeFrom.value).subscribe(
      data => {
        this.toastr.success('Office has been created.');
        this.router.navigateByUrl('/setting/list/offices');
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
        console.log('Office error is ' + this.error);
      }
      // this.response = data;
    );
  }
  getGroups() {
    this.Api.get('/groups', { per_page: 'all' }).subscribe(data => {
      this.Groups = data.data;
      console.log(this.Groups)
    });
  }
}
