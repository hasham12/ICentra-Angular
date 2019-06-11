import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {saveAs} from 'file-saver';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-priority',
  templateUrl: './priority.component.html',
  styleUrls: ['./priority.component.css']
})
export class PriorityComponent implements OnInit {
  search: { [k: string]: any } = {};
  priorities: any;
  searchedPriorities: any;
  checkboxSelection: { [k: string]: any } = {};
  deleteDisable = true;
  searched = '';
  bulkOptions = [
    {id: 1, name: 'Delete'},
  ];
  selectedBulk = null;

  constructor(private api: ApiService, private toastr: ToastrService,
              private http: HttpClient
  ) {
  }

  ngOnInit() {
    this.getData();
  }
  getData() {
    this.api.get('/priorities').subscribe(res => {
      this.priorities = res;
      this.searchedPriorities = res.data;
    });
  }

  exportResult() {
    this.search['export'] = 1;
    this.http.get(environment.apiUrl + '/' + environment.api_prefix + '/priorities', {
      responseType: 'blob', params: this.search
    }).subscribe(res => {
      saveAs(res, `priorities-` + new Date() + `.csv`);
    });
  }

  selectAll(value) {
    if (value) {
      this.priorities.data.forEach((type) => {
        this.checkboxSelection[type.id] = true;
      });
    } else {
      this.priorities.data.forEach((type) => {
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
      this.api.post('/priorities/' + id, {'_method': 'DELETE'}).subscribe(res => {
      });
    });
    this.toastr.success('Priority Deleted');
    this.getData();
  }

  fetchBySearch() {
    this.api.get('/priorities?s=' + this.searched).subscribe(res => {
      this.searchedPriorities = res.data;
    });
  }

  filterItem(key, value) {
    this.search[key] = value;
    this.api.get('/priorities', this.search).subscribe(res => {
      this.priorities = res;
    });
  }
}
