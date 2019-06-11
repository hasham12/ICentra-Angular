import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report/report.service';
import { ApiService } from '../../../services/api.service';
import {DatePipe} from '@angular/common';

@Component({
	selector: 'app-all-reports',
	templateUrl: './all-reports.component.html',
	styleUrls: ['./all-reports.component.css']
})
export class AllReportsComponent implements OnInit {
    categories = [
        {
            'key': 'user',
            'name': 'User'
        },
        {
            'key': 'task',
            'name': 'Task Manager'
        },
        {
            'key': 'library',
            'name': 'Library'
        }
    ];
    reports: any;
    users: any;
    selectedUser: any;
    startDate: '';
    endDate: '';
    filterDate: '';
    fromDate: any;
    toDate: any;

    constructor(
        private report: ReportService,
        private api: ApiService,
        private datePipe: DatePipe,
    ) { }

    ngOnInit() {
        // this.getCategories();
        this.getReports();
        this.getUsers();
        this.fromDate = '';
        this.toDate = '';
    }

    getCategories() {
        this.report.getCategories().subscribe(response => {
            this.categories = response.data;
        });
    }

    getReports() {
        this.report.getReports().subscribe(response => {
            this.reports = response.data
        });
    }

    getOffices(offices) {
        return offices.map(office => office.name );
    }

    filterReports (type, data) {
        if (type == 'user') {
            typeof data !== 'undefined' ? this.selectedUser = data.id : this.selectedUser = '';
        }
        if (type == 'date') {
            typeof this.selectedUser == 'undefined' ? this.selectedUser = '' : '';
        }
        if (type == 'my_reports') {
            this.selectedUser = 'auth';
        }

        this.report.getFilteredReports({
            'user' : this.selectedUser,
            'from_date': this.fromDate,
            'to_date': this.toDate
        }).subscribe(response => {
            this.reports = response.data;
        });
    }

    filterCategory(category) {
        let param = {
            'from_date': this.fromDate,
            'to_date': this.toDate
        };

        if (this.selectedUser) {
            param['user'] = this.selectedUser
        }

        if (category) {
            param['module_type'] = category;
        }

        this.report.getFilteredReports(param).subscribe(response => {
            this.reports = response.data;
        });
    }

    getUsers() {
        this.api.get('/users').subscribe(data => {
            let response = data.data;
            response.map((i) => { i.fullName = i.first_name + ' ' + i.last_name; return i; });
            this.users = response;
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
}
