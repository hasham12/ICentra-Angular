import {Component, OnInit} from '@angular/core';
import * as $ from 'jquery';
import {TaskService} from '../../../services/task/task.service';
import {DatePipe} from '@angular/common';
import {environment} from '../../../../environments/environment';
import {saveAs} from 'file-saver';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../../services/auth/auth.service';
import {ToastrService} from 'ngx-toastr';
import {ApiService} from '../../../services/api.service';

@Component({
    selector: 'app-my-tasks',
    templateUrl: './my-tasks.component.html',
    styleUrls: ['./my-tasks.component.css']
})
export class MyTasksComponent implements OnInit {
    public userDate: any;
    typeList: any;
    taskList: { [k: string]: any } = {};
    statusList: any;
    priorityList: any;
    groupUserList: any;
    assigns: any;
    mainAssigns: any;
    search: { [k: string]: any } = {};
    pageNum: number;
    due_date = '';
    keyword = '';
    statusListSelection = 'empty';
    checkboxSelection: { [k: string]: any } = {};
    applyDisable = true;
    bulkOptions = [
        {id: 1, name: 'Delete'},
        {id: 2, name: 'Change Status'},
        {id: 3, name: 'Change Priority'},
    ];
    selectedBulk = null;
    selectedStatusBulk = null;
    selectedPriorityBulk = null;
    public AuthUser: any;

    error = null;
    constructor(private task: TaskService,
                private datePipe: DatePipe,
                private Auth: AuthService,
                private Http: HttpClient,
                private toastr: ToastrService,
                private api: ApiService
    ) {
    }

    ngOnInit() {
        this.search['only'] = 'me';
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
        this.api.get('/priorities').subscribe(res => {
            this.priorityList = res.data;
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
            },
            error => {
                this.error = Array.of(error.error.errors);
                if (error.message && error.status_code !== 500) {
                    this.toastr.error(this.error, error.error.message);
                } else {
                    this.toastr.error(
                        'Something wrong with the form. Please check and try again.'
                    );
                }
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
        console.log(this.search);
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

    checkedBoxStatus(id, value) {
        if (value === true) {
            this.checkboxSelection[id] = value;
        } else {
            delete this.checkboxSelection[id];

        }
        this.selectionStatus();
    }

    disableApplyBtn() {
        if (Object.keys(this.checkboxSelection).length === 0) {
            return true;
        } else {
            if (this.selectedBulk === 1) {
                return false;
            } else if (this.selectedBulk === 2) {

            }
        }
    }

    selectionStatus() {
        if (Object.keys(this.checkboxSelection).length === 0) {
            this.applyDisable = true;
        } else {
            this.applyDisable = false;
        }
    }

    application() {
        if (this.selectedBulk === 1) {
            this.api.post('/task-bulk-delete', this.checkboxSelection).subscribe(res => {
                this.toastr.success(res.message);
                this.getTasks();
            });
        }
        if (this.selectedBulk === 2) {
            if (this.selectedStatusBulk !== null) {
                Object.keys(this.checkboxSelection).forEach(id => {
                    this.changeStatus(<any>id * 1, this.selectedStatusBulk);
                });
                this.selectedStatusBulk = null;
            }
            this.checkboxSelection = {};
            this.selectedBulk = null;
        }
        if (this.selectedBulk === 3) {
            if (this.selectedPriorityBulk !== null) {
                Object.keys(this.checkboxSelection).forEach(id => {
                    this.api.put('/tasks/' + id + '/set-priority', {priority_id: this.selectedPriorityBulk}).subscribe(res => {});
                });
                this.selectedPriorityBulk = null;
                this.toastr.success('Task Priority Changed');
            }
            this.checkboxSelection = {};
            this.selectedBulk = null;
        }
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

    deleteThose() {
        if (Object.keys(this.checkboxSelection).length > 0) {
            let ctr = 0;
            Object.keys(this.checkboxSelection).forEach(id => {
                ctr = ctr + 1;
                this.api.post('/tasks/' + id, {'_method': 'DELETE'}).subscribe(res => {
                    const meDel = this.taskList.data.filter(t => t.id === 1 * <any>id);
                    this.taskList.data.splice(this.taskList.data.indexOf(meDel[0]), 1);
                });
            });
            if (ctr > 0) {
                this.getTasks();
                this.applyDisable = true;
                this.checkboxSelection = {};
                this.selectedBulk = null;
                this.toastr.success('Task(s) has been Deleted');
            }
        }
    }

    clearFilters() {
        this.search = {};
        this.statusList.forEach( st => {
            st.selected = false;
        });
        this.keyword = '';
        this.statusListSelection = 'empty';
        this.assigns = this.mainAssigns;
        this.userDate = {};
        this.getTasks();
    }
}
