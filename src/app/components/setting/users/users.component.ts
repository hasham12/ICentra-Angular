import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray
} from '@angular/forms';
import { User } from './../../../models/user.model';
import { Pagination } from './../../../models/pagination.model';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import 'rxjs/add/operator/map';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  constructor(
    private Api: ApiService,
    private formbuilder: FormBuilder,
    private toastr: ToastrService,
    private Http: HttpClient
  ) {}
  public Users: any[];
  public Pagination: Pagination;
  public per_page = 25;
  public current_page = 1;
  public role_id = '';
  public roles: any;
  public filteredRoles: any;
  public groups = '';
  public offices: any;
  public total: any;
  public Search: FormGroup;
  public query = '';
  public roleQuery = '';
  public bulkAction: FormGroup;
  public u: any[] = [];
  public selectedUsers: any[] = [];
  public actions: any[] = [
    { id: 'delete', name: 'Delete' },
    { id: 'move', name: 'Move' },
    { id: 'copy', name: 'Copy' },
  ];
  public SortBy = '';
  public SortOrder: any;
  public Sorted = false;

  public inset2dark = { axis: 'y'};

  ngOnInit() {
    console.log(this.actions);
    this.current_page = 1;
    this.getUsers(this.current_page, this.per_page);
    this.getRoles();
    this.getGroups();
    this.getOffices();
    /* create form for search */
    this.Search = new FormGroup({
      query: new FormControl()
    });
    /* create form for bulk action */
    this.bulkAction = new FormGroup({
      action: new FormControl(),
      role: new FormControl(),
      office: new FormControl(),
      groups: new FormControl()
    });
  }


  getSorted(SortBy) {
    if (this.SortBy === SortBy) {
      this.SortBy = '';
    } else {
      this.SortBy = SortBy;
    }
    this.getUsers(
      this.current_page,
      this.per_page,
      this.role_id,
      this.query,
      this.SortBy
    );
  }

  getUsers(
    page = null,
    per_page = 25,
    role = this.role_id,
    query = '',
    SortBy = this.SortBy,
    include = 'groups,offices'
  ) {
    SortBy = this.SortBy;
    this.Api.get('/users', {
      page: page,
      per_page: per_page,
      role: role,
      search: query,
      sort: SortBy,
      include
    }).subscribe(data => {
      this.Users = data.data as User[];
      console.log('data of users inside function' + JSON.stringify(this.Users));
      this.Pagination = data.meta.pagination;
      if (role === '' && this.Pagination.total) {
        this.total = this.Pagination.total;
      }
      console.log(
        'pagination inside function' + JSON.stringify(this.Pagination)
      );
    });
  }
  getRoles(roleQuery = '') {
    this.Api.get('/roles', { per_page: 'all', search: roleQuery }).subscribe(data => {
      this.roles = data.data;
      this.RoleassignCopy();
    });
  }
  searchRoles(roleQuery = ''){
    this.getRoles(roleQuery);
  }
  getGroups() {
    this.Api.get('/groups', { per_page: 'all' }).subscribe(data => {
      this.groups = data.data;
    });
  }
  getOffices() {
    this.Api.get('/offices', { per_page: 'all' }).subscribe(data => {
      this.offices = data.data;
    });
  }

  searchUser() {
    this.query = this.Search.controls['query'].value
      ? this.Search.controls['query'].value
      : '';
    this.getUsers('', this.per_page, '', this.query);
  }

  checkAll(ev) {
    this.Users.forEach(x => {
      x.selected = ev.target.checked;
      this.selectedUsers.push(x.id);
    });
    if (!ev.target.checked) {
      this.selectedUsers = [];
    }
    console.log('selected users inside checkall ' + this.selectedUsers);
  }

  isAllChecked() {
    if (this.Users) {
      return this.Users.every(_ => _.selected);
    } else {
      return false;
    }
  }
  onUserSelected(user_id: string, isChecked: boolean) {
    if (isChecked) {
      this.selectedUsers.push(user_id);
    } else {
      const index = this.selectedUsers.indexOf(user_id);
      this.selectedUsers.splice(index, 1);
    }
    console.log('selected users inside isallcheck ' + this.selectedUsers);
  }
  Action() {
    console.log('form values' + this.bulkAction.value);
    const formvalues = this.bulkAction.value;
    Object.assign(formvalues, { 'users[]': this.selectedUsers });

    if (this.selectedUsers.length > 0) {
      this.Api.post('/users/action', formvalues).subscribe(
        data => {
          this.toastr.success(data.message);
          this.getUsers(this.current_page, this.per_page);
          this.bulkAction.reset();
        },
        error => {
          this.toastr.error('Something went wrong, please try again later');
        }
      );
    }
  }

 RoleassignCopy() {
    this.filteredRoles = Object.assign([], this.roles);
  }
 RolefilterItem(value) {
    if (!value) {
        this.RoleassignCopy();
    } // when nothing has typed
    this.filteredRoles = Object.assign([], this.roles).filter(
       item => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1
    )
 }
 usersExport(){
   this.Http.get(environment.apiUrl+'/'+environment.api_prefix+'/users/export', {
    responseType: 'blob'
  }).subscribe(
    data => {
      saveAs(data, `csv users_` + new Date() + `.csv`);
    }
   );
 }
}
