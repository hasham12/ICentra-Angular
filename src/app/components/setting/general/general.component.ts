import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth/auth.service';
import {ApiService} from '../../../services/api.service';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-general',
    templateUrl: './general.component.html',
    styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {

    liveData: any;
    AuthUser: any;
    all_notifications = false;
    setting = {
        task_assign: null,
        task_create: null,
        task_update: null
    };

    constructor(private Auth: AuthService, private api: ApiService, private toastr: ToastrService) {
    }

    ngOnInit() {
        // this.Auth.UserSub.subscribe(user => {
        //   this.AuthUser = user;
        // });
        this.api.get('/task-general-settings').subscribe(res => {
            if (res.data.length === 0) {
                this.all_notifications = true;
                this.setAll(true);
            } else {
                Object.keys(this.setting).forEach(key => {
                    this.setting[key] = res.data[key] === "1" ? true : false;
                });
            }
        });
    }

    setChanges() {
            this.api.post('/task-general-settings', this.setting).subscribe(res => {
                this.toastr.success(res.message);
            });
    }


    setAll(value) {
        Object.keys(this.setting).forEach(key => {
            this.setting[key] = value;
        });

    }
}
