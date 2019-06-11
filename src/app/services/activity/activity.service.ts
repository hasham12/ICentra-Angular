import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ActivityService {
    private baseUrl = environment.apiUrl;

    constructor(private api: ApiService) { }

    getActivities() {
        return this.api.get('/activities?include=activityComments');
    }

}