import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ReportService } from '../../../services/report/report.service';

@Component({
    selector: 'app-create-report',
    templateUrl: './create-report.component.html',
    styleUrls: ['./create-report.component.css']
})
export class CreateReportComponent implements OnInit {
    removedItem = {};
    dataItems = [];
    moduleItems = [
        {
            'type': 'user',
            'label': 'User',
            'data_types': []
        },
        {
            'type': 'task',
            'label': 'Task',
            'data_types': []
        },
        {
            'type': 'library',
            'label': 'Library',
            'data_types': []
        }
    ];

    moduleSelectedItems = [];

    data = {
        'user': [
            {
                'field': 'level_id',
                'label': 'Level'
            },
            {
                'field': 'role_id',
                'label': 'Roles'
            },
            {
                'field': 'first_name',
                'label': 'First Name'
            },
            {
                'field': 'last_name',
                'label': 'Last Name'
            },
            {
                'field': 'email',
                'label': 'Email'
            },
            // {
            //     'field': 'login_date',
            //     'label': 'Login Date'
            // },
            // {
            //     'field': 'offiec',
            //     'label': 'Offices'
            // },
            // {
            //     'field': 'groups',
            //     'label': 'Groups'
            // },
            {
                'field': 'position',
                'label': 'Position'
            }
        ],
        'task': [
            {
                'field': 'title',
                'label': 'Title'
            },
            // {
            //     'field': 'assignee',
            //     'label' : 'Assignee'
            // },
            {
                'field': 'job_type_id',
                'label': 'Job Type'
            },
            {
                'field': 'task_category_id',
                'label': 'Category'
            },
            {
                'field': 'task_status_id',
                'label': 'Task Status'
            },
            {
                'field': 'property_id',
                'label': 'Property'
            },
            // {
            //     'field': 'comments',
            //     'label' : 'Comments'
            // },
            {
                'field': 'start_date',
                'label': 'Start Date'
            },
            // {
            //     'field': 'attachments',
            //     'label' : 'Attachments'
            // },
            {
                'field': 'priority_id',
                'label': 'Priority'
            },
            {
                'field': 'due_date',
                'label': 'Due Date'
            },
        ],
        'library': [
            {
                'field': 'title',
                'label': 'Title'
            },
            {
                'field': 'description',
                'label': 'Description'
            },
            // {
            //     'field': 'category',
            //     'label': 'Categories'
            // }
        ]
    };

    selectedModule = {
        'key': '',
        'label': '',
        'data_types': []
    };
    reportName = '';


    constructor(private report: ReportService) { }

    ngOnInit() { }

    /**
     *
     * @param {CdkDragDrop<string[]>} event
     */
    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);

            this.resetItems();
        }
    }

    /**
     *
     * @param {CdkDragDrop<string[]>} event
     */
    dropInModule(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {

            if (event.container.data.length) {
                return;
            }

            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);


            const module = event.container.data[event.currentIndex];
            module['data_types'] = [];

            this.selectModule(module, 0);
        }
    }

    /**
     * Add module by click
     * @param module index
     */
    addModule(module, index) {
        module['data_types'] = [];

        if (this.selectedModule.key !== '') {
            this.moduleItems.push({
                type: this.selectedModule.key,
                label: this.selectedModule.label,
                data_types: this.selectedModule.data_types
            });
        }
        this.moduleItems.splice(index, 1);

        this.moduleSelectedItems = [];
        this.moduleSelectedItems.push(module);

        this.selectModule(module, 0);
    }

    /**
     * Drop condition method
     *
     * @param {CdkDragDrop<string[]>} event
     */
    dropData(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
        }
    }


    /**
     * Create report API call
     */
    createReport() {
        const data = {
            name: this.reportName,
            category_id: 1,
            module_type: this.moduleSelectedItems[0].type,
            data_types: this.moduleSelectedItems[0].data_types
        };

        this.report.saveReports(data).subscribe(response => {
            console.log(response.data);
        });
    }

    selectModule(module, i) {
        this.resetItems();
        this.selectedModule = module;
        this.dataItems = this.data[module.type];
    }

    resetItems() {
        this.dataItems = [];
        this.selectedModule = {
            'key': '',
            'label': '',
            'data_types': []
        };
    }

}
