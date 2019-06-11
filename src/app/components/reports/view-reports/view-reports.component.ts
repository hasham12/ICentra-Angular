import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report/report.service';
import { ApiService } from '../../../services/api.service';
import {DatePipe} from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import {environment} from '../../../../environments/environment';
import {saveAs} from 'file-saver';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';

@Component({
	selector: 'app-view-report',
	templateUrl: './view-reports.component.html',
	styleUrls: ['./view-reports.component.css']
})
export class ViewReportComponent implements OnInit {
    categories: any;
    reports: any;
    users: any;
    selectedUser: '';
    filterDate: '';
    fromDate: any;
    toDate: any;
    headerAttribute: any = [];

    data = {
        'user': [
            'level_id',
            'role_id'
        ],
        'task': [
            'task_category_id',
            'task_status_id',
            'priority_id',
            'job_type_id',
            'property_id'
        ],
        'library': []
    };

    constructor(
        private report: ReportService,
        private api: ApiService,
        private datePipe: DatePipe,
        private route: ActivatedRoute,
        private Http: HttpClient,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.reports = [];
        this.getReportById();
        this.getUsers();
        this.fromDate = '';
        this.toDate = '';
        console.log(this.reports);
    }

    getReportById() {
        let id = this.route.snapshot.paramMap.get("id");
        this.report.getReportById(id).subscribe(response => {
            this.reports = response.data;

            // Removed relational IDs
            if (this.reports.length > 0 ) {
                let attributes = Object.keys(this.reports[0]);

                this.headerAttribute = attributes.filter(f => !this.data[response.module_type].includes(f));
            }
        });
    }

    filterReports (type, data) {
        let id = this.route.snapshot.paramMap.get("id");

        if (type == 'user') {
            typeof data !== 'undefined' ? this.selectedUser = data.id : this.selectedUser = '';
        }
        if (type == 'date') {
            typeof this.selectedUser == 'undefined' ? this.selectedUser = '' : '';
        }

        let params = this.getReportFilterParam();

        this.report.getFilteredReportView(id, params).subscribe(response => {
            this.reports = response.data;

            // Removed relational IDs
            if (this.reports.length > 0 ) {
                let attributes = Object.keys(this.reports[0]);

                this.headerAttribute = attributes.filter(f => !this.data[response.module_type].includes(f));
            }
        });
    }

    changeDates() {
        if (this.filterDate) {
            this.fromDate = this.datePipe.transform(this.filterDate[0], 'yyyy-MM-dd');
            this.toDate = this.datePipe.transform(this.filterDate[1], 'yyyy-MM-dd');
        } else {
            this.fromDate = '';
            this.toDate = '';
        }
        this.filterReports('date', '');
    }

    getReportValue(report) {
        if (typeof report !== 'object') {
            return report;
        }

        if (!report) {
            return '';
        }

        return report.name || report.title || '';
    }

    generateTitle(name) {
        return name.split('_').join(' ');
    }

    getUsers() {
        this.api.get('/users').subscribe(data => {
            let response = data.data;
            response.map((i) => { i.fullName = i.first_name + ' ' + i.last_name; return i; });
            this.users = response;
            console.log(this.users);
        });
    }

    exportResult() {
        let params = this.getReportFilterParam();
        params['export'] = 1;
        let id = this.route.snapshot.paramMap.get("id");
        this.Http.get(environment.apiUrl + '/' + environment.api_prefix + '/reports/generate/' + id, {
            responseType: 'blob', params: params
        }).subscribe(
            data => {
                saveAs(data, `reports-` + new Date() + `.csv`);
            }
        );
        this.toastr.success('Export results are downloaded');
    }

    getReportFilterParam() {

        let params = {};

        if (this.selectedUser) {
            params['user_id'] = this.selectedUser;
        }

        if (this.fromDate) {
            params['from_date'] = this.fromDate;
        }

        if (this.fromDate) {
            params['to_date'] = this.toDate;
        }

        return params;
    }
}
