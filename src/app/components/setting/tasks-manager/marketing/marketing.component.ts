import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import {environment} from '../../../../../environments/environment';
import {saveAs} from 'file-saver';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-marketing',
  templateUrl: './marketing.component.html',
  styleUrls: ['./marketing.component.css']
})
export class MarketingComponent implements OnInit {
  taskList: any;
  search: { [k: string]: any } = {};
  taskListSearched: any;
  checkboxSelection: { [k: string]: any } = {};
  deleteDisable = true;
  searched = '';
  bulkOptions = [
    {id: 1, name: 'Delete'},
  ];
  selectedBulk = null;

  constructor(private api: ApiService, private http: HttpClient, private toastr: ToastrService) { }

  ngOnInit() {
    this.api.get('/task-sets?include=marketingTasks').subscribe(res => {
      this.taskList = res;
      this.taskListSearched = res.data;
    });
  }

  exportResult() {
    this.search['export'] = 1;
    this.http.get(environment.apiUrl + '/' + environment.api_prefix + '/task-sets', {
      responseType: 'blob', params: this.search
    }).subscribe(res => {
      saveAs(res, `task-categories-` + new Date() + `.csv`);
    });
  }

  fetchBySearch() {
    this.api.get('/task-sets?s=' + this.searched).subscribe(res => {
      this.taskListSearched = res.data;
    });
  }
  selectAll(value) {
    if (value) {
      this.taskList.data.forEach((type) => {
        this.checkboxSelection[type.id] = true;
      });
    } else {
      this.taskList.data.forEach((type) => {
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

  deleteThose() {
    Object.keys(this.checkboxSelection).forEach(id => {
      this.api.post('/task-sets/' + id, {'_method': 'DELETE'}).subscribe(res => {
      });
    });
    this.api.get('/task-sets?include=marketingTasks').subscribe(res => {
      this.taskList = res;
      this.taskListSearched = res.data;
      this.toastr.success('Task Deleted');
    });
  }

  filterItem(key, value) {
    this.search[key] = value;
    this.api.get('/task-sets?include=marketingTasks', this.search).subscribe(res => {
      this.taskList = res;
    });
  }

}
