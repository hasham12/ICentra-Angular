import {Component, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {ApiService} from '../../../services/api.service';

@Component({
    selector: 'app-incomplete',
    templateUrl: './incomplete.component.html',
    styleUrls: ['./incomplete.component.css']
})
export class IncompleteComponent implements OnInit {

    statuses: any;
    constructor(private api: ApiService) {
    }

    ngOnInit() {
        this.api.get('/task-statuses?include=tasks').subscribe( res => {
            this.statuses = res.data;
        });
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
        // this.api.post('task/' + newOne +'/status', {})
    }
    getConnectedTo(id) {
        const myArr = this.statuses.filter( status => status.id !== id);
        const mee = myArr.map(a => 's_' + a.id.toString());
        return  mee;
    }

}
