import {Injectable} from '@angular/core';
import {ApiService} from '../api.service';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TaskService {

    private baseUrl = environment.apiUrl;

    constructor(private api: ApiService) {
    }

    changeTaskStatus(taskId: number, statusId: number) {
        return this.api.post('/tasks/' + taskId + '/task-status/', {id: statusId});
    }

    getTasksWithFilter(filter: any) {
        return this.api.get('/tasks?include=user,assigns,taskStatus,jobType,property', filter);
    }

    taskDashboard() {
        return this.api.get('/tasks/dashboard');
    }

    addTask(userData) {
        console.log(userData);
        return this.api.post('/tasks', userData);
    }

    getCategories() {
        return this.api.get('/task-categories');
    }

    bill(printType, category, qty) {
        return this.api.get('/task-categories/' + category + '/printing-type/' + printType + '/quantity/' + qty);
    }

    getStatuses() {
        return this.api.get('/task-statuses');
    }

    getTypes() {
        return this.api.get('/job-types');
    }

    getProperties() {
        return this.api.get('/properties');
    }

    getPriorities() {
        return this.api.get('/priorities');
    }

    getSets() {
        return this.api.get('/task-sets?include=marketingTasks');
    }

    marketingTasksByTaskSet(id, date) {
        return this.api.get('/marketing-tasks-by-task-sets/' + id + '?include=jobType,taskCategory,taskStatus,priority&date=' + date);
    }

    getTaskById(id) {
        return this.api.get('/tasks/' + id + '?include=assigns,taskStatus,jobType,property,billings,attachments');
    }

    gUsers() {
        return this.api.get('/users-by-offices');
    }
}
