import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import {saveAs} from 'file-saver';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-job-type',
    templateUrl: './job-type.component.html',
    styleUrls: ['./job-type.component.css']
})
export class JobTypeComponent implements OnInit {
    search: { [k: string]: any } = {};
    jobTypes: any;
    jobTypesSearched: any;
    checkboxSelection: { [k: string]: any } = {};
    deleteDisable = true;
    searchQuery = '';
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
        this.api.get('/job-types').subscribe(res => {
            this.jobTypes = res;
            this.jobTypesSearched = res.data;
        });
    }

    fetchBySearch() {
        this.api.get('/job-types?s=' + this.searchQuery).subscribe(res => {
            this.jobTypesSearched = res.data;
        });
    }

    exportResult() {
        this.search['export'] = 1;
        this.http.get(environment.apiUrl + '/' + environment.api_prefix + '/job-types', {
            responseType: 'blob', params: this.search
        }).subscribe(res => {
            saveAs(res, `job-types-` + new Date() + `.csv`);
        });
    }

    deleteThis(typeId) {
        this.api.post('/job-types/' + typeId, {_method: 'DELETE'}).subscribe(res => {
            this.getData();
        });
    }

    selectAll(value) {
        if (value) {
            this.jobTypes.data.forEach((type) => {
                this.checkboxSelection[type.id] = true;
            });
        } else {
            this.jobTypes.data.forEach((type) => {
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
            this.api.post('/job-types/' + id, {'_method': 'DELETE'}).subscribe(res => {
            });
        });
        this.toastr.success('Job Type(s) has been Deleted');
        this.getData();
    }

    

    filterItem(key, value) {
        this.search[key] = value;
        this.api.get('/job-types', this.search).subscribe(res => {
            this.jobTypes = res;
        });
    }
}
