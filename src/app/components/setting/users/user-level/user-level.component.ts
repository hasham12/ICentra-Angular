import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import {ToastrService} from 'ngx-toastr';
import {environment} from '../../../../../environments/environment';
import {saveAs} from 'file-saver';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-user-level',
  templateUrl: './user-level.component.html',
  styleUrls: ['./user-level.component.css']
})
export class UserLevelComponent implements OnInit {
  public bulkAction = null;
  levels: any;
  search: { [k: string]: any } = {};
  realLevels: any;
  Pagination: any;
  deleteDisable = true;
  searched = '';
  checkboxSelection: { [k: string]: any } = {};
  public actions: any[] = [
    { id: 'delete', name: 'Delete' },
  ];
  constructor(private api: ApiService, private toastr: ToastrService, private http: HttpClient) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.api.get('/user-levels').subscribe(res => {
      this.levels = res.data;
      this.realLevels = res.data;
      this.Pagination = res.meta.pagination;
    });
  }

  selectAll(value) {
    if (value) {
      this.levels.forEach((type) => {
        this.checkboxSelection[type.id] = true;
      });
    } else {
      this.levels.forEach((type) => {
        delete this.checkboxSelection[type.id];
      });
    }
    this.selectionStatus();
  }

  checkedBoxStatus(id, value) {
    if (value === true) {
      this.checkboxSelection[id] = value;
    } else {
      delete this.checkboxSelection[id];

    }
    this.selectionStatus();
  }

  selectionStatus() {
    if (Object.keys(this.checkboxSelection).length === 0) {
      this.deleteDisable = true;
    } else {
      this.deleteDisable = false;
    }
  }

  levelsExport() {
    this.search['export'] = 1;
    this.http.get(environment.apiUrl + '/' + environment.api_prefix + '/user-levels', {
      responseType: 'blob', params: this.search
    }).subscribe(res => {
      saveAs(res, `user-level-` + new Date() + `.csv`);
    });

  }

  deleteThose() {
    Object.keys(this.checkboxSelection).forEach(id => {
      this.api.post('/user-levels/' + id, {'_method': 'DELETE'}).subscribe(res => {
      });
    });
    this.toastr.success('Level Deleted');
    this.getData();
  }

  fetchBySearch() {
    this.api.get('/user-levels?s=' + this.searched).subscribe(res => {
      this.realLevels = res.data;
    });
  }

  filterItem(key, value) {
    this.search[key] = value;
    this.api.get('/user-levels', this.search).subscribe(res => {
      this.levels = res.data;
    });
  }

}
