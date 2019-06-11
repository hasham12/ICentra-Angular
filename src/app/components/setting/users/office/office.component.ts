import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Pagination } from 'src/app/models/pagination.model';

@Component({
  selector: 'app-office',
  templateUrl: './office.component.html',
  styleUrls: ['./office.component.css']
})
export class OfficeComponent implements OnInit {

  constructor(private Api: ApiService, private toastr: ToastrService) { }
  public Offices: any;
  public filteredOffices: any;
  public leftOffices: any;
  public Pagination: Pagination;
  public per_page: number;
  public current_page: number;
  public selectedOffices = [];
  public selectedAction: null;
  public actions = [{'id': 'delete', 'name': 'Delete'}];
  public query = '';
  ngOnInit() {
    this.current_page = 1;
    this.per_page = 25;
    this.getOffices(this.current_page, this.per_page);
    this.allOffices();

  }
  getOffices(page = null, per_page = null) {
      this.Api.get('/offices',  { page: page, per_page: per_page } ).subscribe(data => {
        this.Offices = data.data;
        console.log('data of offices inside function' + JSON.stringify(this.Offices));
        this.Pagination = data.meta.pagination;
        console.log('pagination inside function' + JSON.stringify(this.Pagination));
      }
    );
  }
  allOffices(per_page = 'all') {
    this.Api.get('/offices',  { per_page: per_page} ).subscribe(data => {
      this.leftOffices = data.data;
      this.OfficeassignCopy();
    }
  );
}
checkAll(ev) {
  this.Offices.forEach(x => {
    x.selected = ev.target.checked;
    this.selectedOffices.push(x.id);
   });
   if (!ev.target.checked) {
    this.selectedOffices = [];
   }
   console.log('selected users inside checkall ' + this.selectedOffices);
}

isAllChecked() {
  if (this.Offices) {
   return this.Offices.every(_ => _.selected);
  } else {
    return false;
  }
}
onOfficeSelected(group_id: string, isChecked: boolean) {
  if (isChecked) {
    this.selectedOffices.push(group_id);
  } else {
    const index = this.selectedOffices.indexOf(group_id);
    this.selectedOffices.splice(index, 1);
  }
  console.log('selected groups inside isallcheck ' + this.selectedOffices);

}
action() {
  console.log('form values' + this.selectedOffices +  this.selectedAction);
  const formvalues  = new Object;
  Object.assign(formvalues, { 'offices[]': this.selectedOffices, 'action': this.selectedAction });

  if (this.selectedOffices.length > 0) {
    this.Api.post('/offices/action', formvalues).subscribe(
      data => {
        this.toastr.success(data.message);
        this.getOffices(this.current_page, this.per_page);
        this.checkAll(false);
      },
      error => {
        this.toastr.error('Something went wrong, please try again later');
      }
    );
  }
}
OfficeassignCopy() {
  this.filteredOffices = Object.assign([], this.leftOffices);
}
OfficefilterItem(value) {
  if (!value){
      this.OfficeassignCopy();
  } // when nothing has typed
  this.filteredOffices = Object.assign([], this.leftOffices).filter(
     item => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1
  );
}

}
