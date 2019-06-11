import { FormHelper } from 'src/app/helpers/form-helper';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-office',
  templateUrl: './edit-office.component.html',
  styleUrls: ['./edit-office.component.css']
})
export class EditOfficeComponent implements OnInit {

  constructor(
    private Api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private formHelper: FormHelper,
  ) {}
  OfficeFrom: FormGroup;
  public Office: any;
  public sub: any;
  public error = null;
  public office_id: string;
  public Groups: any;
  ngOnInit() {
    this.OfficeFrom = new FormGroup({
      id: new FormControl(),
      name: new FormControl('', [Validators.required]),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.email, Validators.required]),
      position: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [Validators.required]),
      website: new FormControl('', [Validators.required]),
      group_id: new FormControl('', [Validators.required]),
      address_line_1: new FormControl('', [Validators.required]),
      address_line_2: new FormControl(''),
      country: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      suburb: new FormControl('', [Validators.required]),
      postcode: new FormControl('', [Validators.required]),
      notes: new FormControl()
    });
    this.sub = this.route.params.subscribe(params => {
      this.office_id = params['id'];
      this.getOffice(this.office_id);
      this.getGroups();
    });

  }

  getOffice(id = null) {
    if (id) {
      this.Api.get('/offices/' + id).subscribe(data => {
        this.Office = data.data;
        this.OfficeFrom.setValue(this.Office);
      },
      error => {
        this.error  = error;
      });
    }
  }
  updateOffice() {
    this.formHelper.validateAllFormFields(this.OfficeFrom);
    if (this.OfficeFrom.invalid && this.office_id) {
      console.log('invalid form' + this.OfficeFrom.invalid);
      return false;
    }
    this.Api.put('/offices/' + this.office_id, this.OfficeFrom.value).subscribe(
      data => {
        this.toastr.success('Office has been updated.');
        this.router.navigateByUrl('/setting/list/offices');
      },
      error => {
        this.error = Array.of(error.error.errors);
        this.toastr.success('Somthing wrong with the form. Please check and try again.');
        console.log('Office error is ' + this.error);
      }
      // this.response = data;
    );
  }

  getGroups(per_page = 'all') {
    this.Api.get('/groups',  { per_page: per_page } ).subscribe(data => {
      this.Groups = data.data;
      }
    );
  }

}
