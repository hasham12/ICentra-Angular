import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit } from '@angular/core';
import { Pagination } from 'src/app/models/pagination.model';
import { Group } from 'src/app/models/group.model';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  constructor(private Api: ApiService, private toastr: ToastrService) { }
  public Groups: any;
  public filteredGroups: any;
  public AllGroups: any;
  public Pagination: Pagination;
  public per_page: number;
  public current_page: number;
  public selectedGroups = [];
  public actions = [{'id': 'delete', 'name': 'Delete'}];
  public selectedAction = null;
  public query = '';
    ngOnInit() {
    this.current_page = 1;
    this.per_page = 25;
    this.getGroups(this.current_page, this.per_page);
    this.getAllGroups();
     
  }
  getGroups(page = null, per_page = null) {
    this.Api.get('/groups',  { page: page, per_page: per_page }).subscribe(data => {
      this.Groups = data.data as Group[];
      console.log('data of groups inside function' + JSON.stringify(this.Groups));
      this.Pagination = data.meta.pagination;
      console.log('pagination inside function' + JSON.stringify(this.Pagination));
      }
    );
  }
  checkAll(ev) {
    this.Groups.forEach(x => {
      x.selected = ev.target.checked;
      this.selectedGroups.push(x.id);
     });
     if (!ev.target.checked) {
      this.selectedGroups = [];
     }
     console.log('selected users inside checkall ' + this.selectedGroups);
  }

  isAllChecked() {
    if (this.Groups) {
     return this.Groups.every(_ => _.selected);
    } else {
      return false;
    }
  }
  onGroupSelected(group_id: string, isChecked: boolean) {
    if (isChecked) {
      this.selectedGroups.push(group_id);
    } else {
      const index = this.selectedGroups.indexOf(group_id);
      this.selectedGroups.splice(index, 1);
    }
    console.log('selected groups inside isallcheck ' + this.selectedGroups);

  }
  action() {
    console.log('form values' + this.selectedGroups +  this.selectedAction);
    const formvalues  = new Object;
    Object.assign(formvalues, { 'groups[]': this.selectedGroups, 'action': this.selectedAction });
    if (this.selectedGroups.length > 0) {
      this.Api.post('/groups/action', formvalues).subscribe(
        data => {
          this.toastr.success(data.message);
          this.getGroups(this.current_page, this.per_page);
          this.checkAll(false);
        },
        error => {
          this.toastr.error('Something went wrong, please try again later');
        }
      );
    }
  }
  GroupsassignCopy() {
    this.filteredGroups = Object.assign([], this.AllGroups);
  }
  GroupsfilterItem(value) {
    if (!value) {
        this.GroupsassignCopy();
    } // when nothing has typed
    this.filteredGroups = Object.assign([], this.AllGroups).filter(
       item => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
  }
  getAllGroups(per_page = 'all') {
    this.Api.get('/groups',  { per_page: per_page } ).subscribe(data => {
      this.AllGroups = data.data as Group[];
      this.GroupsassignCopy();
      }
    );
  }
}
