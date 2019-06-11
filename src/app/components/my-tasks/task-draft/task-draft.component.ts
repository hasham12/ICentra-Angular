import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../services/api.service';

@Component({
  selector: 'app-task-draft',
  templateUrl: './task-draft.component.html',
  styleUrls: ['./task-draft.component.css']
})
export class TaskDraftComponent implements OnInit {

  draftTasks: any;
  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.get('/tasks/drafts').subscribe( res => {
      this.draftTasks = res.tasks;
    });
  }

}
