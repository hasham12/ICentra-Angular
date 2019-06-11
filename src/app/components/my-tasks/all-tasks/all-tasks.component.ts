import { Component, OnInit } from '@angular/core';
import {TaskService} from '../../../services/task/task.service';
import {DatePipe} from '@angular/common';
import {AuthService} from '../../../services/auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {ApiService} from '../../../services/api.service';
import * as $ from 'jquery';
import {environment} from '../../../../environments/environment';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-all-tasks',
  templateUrl: './all-tasks.component.html',
  styleUrls: ['./all-tasks.component.css']
})
export class AllTasksComponent implements OnInit {
    public userDate: any;
    typeList: any;
    taskList: { [k: string]: any } = {};
    statusList: any;
    groupUserList: any;
    assigns: any;
    mainAssigns: any;
    search: { [k: string]: any } = {};
    pageNum: number;
    due_date = '';
    keyword = '';
    statusListSelection = 'empty';
    public AuthUser: any;

    constructor(private task: TaskService,
                private datePipe: DatePipe,
                private Auth: AuthService,
                private Http: HttpClient,
                private toastr: ToastrService,
                private api: ApiService
    ) {
    }

    ngOnInit() {
        this.search['only'] = 'all';
        $('.moreOptionsToggler').on('click', function (e) {
            e.preventDefault();
            $('.more-options-content').toggleClass('d-none');
        });
        this.Auth.UserSub.subscribe(user => {
            this.AuthUser = user;
            console.log(this.AuthUser);
        });
        this.getStatuses();
        this.getTasks();
        this.getTypes();
        this.getGroupUsers();
        this.api.get('/users-by-offices').subscribe(res => {
            this.assigns = res.data;
            this.mainAssigns = res.data;
        });
    }

    getGroupUsers() {
        this.task.gUsers().subscribe(res => {
            this.groupUserList = res.data;
        });
    }

    getTypes() {
        this.task.getTypes().subscribe(response => {
            this.typeList = response.data;
        });
    }

    getStatuses() {
        this.task.getStatuses().subscribe(response => {
            this.statusList = response.data;
        });
    }

    getTasks() {
        this.task.getTasksWithFilter(this.search)
            .subscribe(response => {
                this.taskList = response;
                this.pageNum = this.taskList.meta.pagination.current_page;
            });
    }

    changeStatus(taskId: number, statusId: number) {
        this.task.changeTaskStatus(taskId, statusId).subscribe(res => {
            this.toastr.success('Task Status is Changed');
            this.getTasks();
        });
    }

    changeDates() {
        if (this.userDate) {
            this.search['start'] = this.datePipe.transform(this.userDate[0], 'yyyy-MM-dd');
            this.search['end'] = this.datePipe.transform(this.userDate[1], 'yyyy-MM-dd');
        } else {
            delete this.search.start;
            delete this.search.end;
        }
        this.getTasks();
    }

    filterItem(key, value) {
        if (key !== 'page') {
            this.search['page'] = 1;
        }
        if (key === 'jobType') {
            if (value !== undefined) {
                value = value.id;
            } else {
                delete this.search['jobType'];
            }
        }
        if (value !== undefined) {
            this.search[key] = value;
        }
        this.getTasks();
    }

    changeCheckBox(status) {
        this.statusListSelection = 'empty';
        this.statusList[this.statusList.indexOf(status)].selected = !status.selected;
        this.filterItem('status[' + status.id + ']', status.selected);
        this.statusList.forEach(st => {
            if (st.selected) {
                this.statusListSelection = 'not empty';
            }
        });
    }

    assignCheckbox(assign, isChecked) {
        if (isChecked) {
            this.filterItem('assign[' + assign.id + ']', true);
        } else {
            delete this.search[assign[assign.id]];
        }
    }

    exportResult() {
        this.search['export'] = 1;
        this.Http.get(environment.apiUrl + '/' + environment.api_prefix + '/tasks', {
            responseType: 'blob', params: this.search
        }).subscribe(
            data => {
                saveAs(data, `tasks-` + new Date() + `.csv`);
            }
        );
        this.toastr.success('Export results are downloaded');
        delete this.search.export;
    }

    deleteTask(task) {
        this.Http.post(environment.apiUrl + '/' + environment.api_prefix + '/tasks/' + task.id, {_method: 'DELETE'}).subscribe(res => {
            this.toastr.success('Task Deleted');
            this.taskList.data.splice(this.taskList.data.indexOf(task), 1);
        });
    }

    filterAssign(text) {
        if (text === '') {
            this.assigns = this.mainAssigns;
        } else {
            const newAssign = this.mainAssigns.filter(assign => assign.first_name.includes(text));
            this.assigns = newAssign;
        }
    }

    orderThis(key, value) {
        this.search['orderBy'] = key;
        this.search['orderByValue'] = value;
        this.getTasks();
    }
}
