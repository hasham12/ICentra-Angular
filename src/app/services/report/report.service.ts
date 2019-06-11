import {Injectable} from '@angular/core';
import {ApiService} from '../api.service';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ReportService {

    private baseUrl = environment.apiUrl;

    constructor(private api: ApiService) {
    }

    getCategories() {
        return this.api.get('/reports/categories');
    }

    getReports() {
        return this.api.get('/reports?include=user,user.offices');
    }

    getFilteredReports(param) {
        return this.api.get('/reports?include=user,user.offices', param);
    }

    getFilteredReportView(id, params) {
        return this.api.get('/reports/generate/'+ id, params);
    }

    saveReports(data) {
        return this.api.post('/reports', data);
    }

    getReportById(id) {
        return this.api.get('/reports/generate/' + id );
    }

    
}
