import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {saveAs} from 'file-saver';
import {AuthService} from '../../../../services/auth/auth.service';
import {Location} from '@angular/common';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
  search: { [k: string]: any } = {};
  Statuses: any;
  SearchedStatuses: any;
  checkboxSelection: { [k: string]: any } = {};
  deleteDisable = true;
  searched = '';
  // deletedArray: any;
  bulkOptions = [
    {id: 1, name: 'Delete'},
  ];
  selectedBulk = null;

  AuthUser: any;
  constructor(private api: ApiService, private Auth: AuthService, private _location: Location,
              private http: HttpClient, private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.Auth.UserSub.subscribe(user => {
      this.AuthUser = user;
      if (this.AuthUser.role_id !== 1) {
        this.toastr.warning('Permission denied - Please contact the Administrator');
        this._location.back();
      }
      console.log(this.AuthUser);
    });
    this.getData();
  }
  getData() {
    this.api.get('/task-statuses').subscribe(res => {
      this.Statuses = res;
      this.SearchedStatuses = res.data;
    });
  }

  exportResult() {
    this.search['export'] = 1;
    this.http.get(environment.apiUrl + '/' + environment.api_prefix + '/task-statuses', {
      responseType: 'blob', params: this.search
    }).subscribe(res => {
      saveAs(res, `task-Statuses-` + new Date() + `.csv`);
    });
  }

  selectAll(value) {
    if (value) {
      this.Statuses.data.forEach((type) => {
        this.checkboxSelection[type.id] = type.id;
        // this.deletedArray.push({id: type.id});
      });
    } else {
      this.Statuses.data.forEach((type) => {
        delete this.checkboxSelection[type.id];
        // this.deletedArray.splice(this.deletedArray.indexOf(type.id), 1);
      });
    }
    this.selectionStatus();
  }

  checkedBoxStatus(id, value) {
    if (value === true) {
      this.checkboxSelection[id] = id;
      // this.deletedArray.push({id: id});
    } else {
      delete this.checkboxSelection[id];
      // this.deletedArray.splice(this.deletedArray.indexOf(id), 1);
    }
    this.selectionStatus();
  }

  selectionStatus() {
    // console.log(this.deletedArray);
    if (Object.keys(this.checkboxSelection).length === 0) {
      this.deleteDisable = true;
    } else {
      this.deleteDisable = false;
    }
  }

  deleteThose() {
    // (<any>$("#confirmDeleteModel")).modal('hide');
    // this.deletedArray.length = 0;
    Object.keys(this.checkboxSelection).forEach(id => {
      this.api.post('/task-statuses/' + id, {'_method': 'DELETE'}).subscribe(res => {
      });
    });
    this.getData();
  }

  fetchBySearch() {
    this.api.get('/task-statuses?s=' + this.searched).subscribe(res => {
      this.SearchedStatuses = res.data;
    });
  }

  filterStatus(id) {
    return this.Statuses.data.filter(f => f.id === id)[0];
  }

  filterItem(key, value) {
    this.search[key] = value;
    this.api.get('/task-statuses', this.search).subscribe(res => {
      this.Statuses = res;
    });
  }
}
