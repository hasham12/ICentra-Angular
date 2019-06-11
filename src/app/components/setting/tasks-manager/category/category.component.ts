import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {saveAs} from 'file-saver';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-taskcategory',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class TaskCategoryComponent implements OnInit {
  search: { [k: string]: any } = {};
  categories: any;
  SearchedCategories: any;
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
    this.api.get('/task-categories').subscribe(res => {
      this.categories = res;
      this.SearchedCategories = res.data;
    });
  }

  exportResult() {
    this.search['export'] = 1;
    this.http.get(environment.apiUrl + '/' + environment.api_prefix + '/task-categories', {
      responseType: 'blob', params: this.search
    }).subscribe(res => {
      saveAs(res, `task-categories-` + new Date() + `.csv`);
    });
  }

  selectAll(value) {
    if (value) {
      this.categories.data.forEach((type) => {
        this.checkboxSelection[type.id] = true;
      });
    } else {
      this.categories.data.forEach((type) => {
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
      this.api.post('/task-categories/' + id, {'_method': 'DELETE'}).subscribe(res => {
      });
    });
    this.checkboxSelection.length = 0;
    this.deleteDisable = true;
    this.toastr.success('Category(s) has been Deleted');
    this.getData();
  }

  fetchBySearch() {
    this.api.get('/task-categories?s=' + this.searched).subscribe(res => {
      this.SearchedCategories = res.data;
    });
  }

  filterItem(key, value) {
    this.search[key] = value;
    this.api.get('/task-categories', this.search).subscribe(res => {
      this.categories = res;
    });
  }
}
