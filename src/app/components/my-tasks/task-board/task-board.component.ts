import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.css']
})
export class TaskBoardComponent implements OnInit {

  error = null;
  assigns: any;
  statuses: any;
  search: { [k: string]: any } = {};
  searchedUsers = [];
  modelTask: any;
  modelTaskEdit: any;

  public inset2dark = { axis: 'y' };

  changeAssigneeList: any;
  constructor(private api: ApiService, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.api.get('/tasks-get-all-by-status').subscribe( res => {
      this.statuses = res.data;
      this.showEditPopUp({id: null});
    });
    this.api.get('/users-all-office').subscribe(res => {
      this.assigns = res.data.map((i) => { i.full_name = i.first_name + ' ' + i.last_name; return i; });
    });
    // for first run dummy work
      this.modelTask = {
          title: null
      };
      this.changeAssigneeList = [-1];
  }

  drop(event: CdkDragDrop<string[]>) { console.log(event);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else { console.log('changed');
      transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
      this.changeStatus(event.container.id, event.previousContainer.id, event.currentIndex);
    }
  }

  changeStatus(newStatus, oldStatus, currentIndex ) {
    const oldStatusRow = this.statuses.filter(st => st.id === newStatus);
    const newOne = oldStatusRow[0].tasks.data[currentIndex].id; // TASK ID
    console.log(oldStatusRow[0].id, newOne);
    this.api.post('/tasks/' + newOne + '/task-status', {id: oldStatusRow[0].id}).subscribe(res => {
      this.toastr.success('Task status changes');
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
  getConnectedTo(id) {
    const myArr = this.statuses.filter( status => status.id !== id);
    const mee = myArr.map(a => 's_' + a.id.toString());
    return  mee;
  }

  filterItem(col, val) {
    if (col === 'search') {
      this.search[col] = val;
    } else if (col === 'user_id') {
      if (this.searchedUsers.indexOf(val) === -1) {
          this.searchedUsers.push(val);
          this.search['user_id[' + val + ']'] = val;
      } else {
        delete this.searchedUsers[this.searchedUsers.indexOf(val)];
          delete this.search['user_id[' + val + ']'];
      }
    }
    console.log(this.search);
      this.api.get('/tasks-get-all-by-status', this.search).subscribe( res => {
          this.statuses = res.data;
      });

  }

  showAssignPopUp(item) {
    this.modelTask = item;
    this.changeAssigneeList = [];
    this.modelTask.assigns.forEach(assign => {
      this.changeAssigneeList.push(assign.user_id);
    });
    console.log(this.changeAssigneeList);
    if (this.modelTask) {
      document.getElementById('openModalAssign').click();
    }
  }

  showEditPopUp(item) {
    this.modelTaskEdit = item;
    if (this.modelTaskEdit) {
      document.getElementById('openModalEdit').click();
    }
  }

  assignNewBtn(modelTask, changeAssigneeList) {
    this.api.post('/task/' + modelTask.id + '/change-assignee', changeAssigneeList).subscribe(r => {
      this.api.get('/tasks-get-all-by-status').subscribe( res => {
        this.statuses = res.data;
        this.modelTask = null;
        this.changeAssigneeList = [];
        (<any>$('#openModalAssignPopUp')).modal('hide');
        this.toastr.success('Task Assignee Updated');
      });
    });
  }

  getPhoto(id) {
    const user = this.assigns.filter(as => as.id === id);
    return user[0].photo_thumb;
  }

  runReload($e) {
      if ($e === 'Task Edited') {
          (<any>$('#openModalEditPopUp')).modal('hide');
          this.api.get('/tasks-get-all-by-status', this.search).subscribe( res => {
              this.toastr.success('Task Updated');
              this.statuses = res.data;
          });

      } else if ($e === 'close this') {
          (<any>$('#openModalEditPopUp')).modal('hide');
      }
  }
}
