import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../../services/api.service';
import {TaskService} from '../../../services/task/task.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-view-task',
    templateUrl: './view-task.component.html',
    styleUrls: ['./view-task.component.css']
})
export class ViewTaskComponent implements OnInit {

    myForm: FormGroup;
    viewId = null;
    task: any;
    taskStatuses: any;
    constructor(private activatedRoute: ActivatedRoute, private api: ApiService, private taskService: TaskService,
                private fb: FormBuilder, private toastr: ToastrService) {
    }

    ngOnInit() {
        this.taskService.getStatuses().subscribe(res => {
            this.taskStatuses = res.data;
        });
        this.myForm = this.fb.group({
            statusValue: ['']
        });
        this.activatedRoute.params.subscribe(params => {
            this.viewId = params['id'];
            this.load(this.viewId);
        });

    }

    load(myId) {
        this.api.get('/tasks/' + myId + '?include=taskStatus,priority,marketingTasks,jobType,property,user,assigns').subscribe(res => {
            this.task = res.data;
            this.myForm.controls['statusValue'].setValue(this.task.task_status_id);
        });
    }
    changeStatus() {
        this.taskService.changeTaskStatus(this.viewId, this.myForm.controls['statusValue'].value).subscribe(res => {
            this.toastr.success('Task Status is Changed');
            this.load(this.viewId);
        });
        console.log(this.myForm.controls['statusValue'].value);
    }
}
