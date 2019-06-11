import {
    Component,
    OnInit,
    ElementRef,
    ViewChild
} from '@angular/core';
import {
    Http,
    Headers
} from '@angular/http';
import {
    NgForm,
    FormBuilder,
    FormGroup,
    Validators
} from '@angular/forms';
import {
    Utils
} from '../../../../utils';
import 'fabric';
import isotope from 'isotope-layout';
import {
    environment as env
} from '../../../../../../environments/environment';

declare const fabric: any;
declare var $: any;

@Component({
    selector: 'app-bgimages',
    templateUrl: './bgimages.component.html',
    styleUrls: ['./bgimages.component.css']
})
export class BgimagesComponent implements OnInit {
    private loading: boolean = false;
    private imgFiles = [];
    private editBgimgid: any;
    public editbgimge: any = '';
    private headers = new Headers({
        'Content-Type': 'application/json'
    });
    public env = env;
    public BgImages: any[];
    public CountImages: any[];
    public CountPatterns: any[];
    public CountImports: any[];
    constructor(private http: Http, private fb: FormBuilder) {
        this.getBGImages();
        this.getBgimagecategory();
        this.getCountPatterns();
        this.getCountImports();
        this.getCountImages();
    }
    ngOnInit() {}
    addbgimgmodal() {
        $("#addbgimgmodal").modal('show');
    }
    editbgimgmodal() {
        $("#editbgimgnamemodal").modal('show');
    }
    editBGimagname(bgimg) {
        this.editbgimge = bgimg.name;
        this.editBgimgid = bgimg.id;
        this.editbgimgmodal();
    }
    triggerfiletype(){
        $('#path').trigger('click');
    }
    onFileChange(event) {
        this.imgFiles = [];
        for(var i = 0; i < event.target.files.length; i++) {
            this.imgFiles.push(event.target.files[i]);
        }
    }
    getBgimagecategory() {
        this.http.get(Utils.getBaseURL('/api/bgimagecategoryget'), {
            headers: this.headers
        }).subscribe(data => {
            let bgimgcats = JSON.parse(( < any > data)._body);
            $('.bgimgcatid').empty();
            $('.bgimgcatid').append($('<option value="">Select Category</option>'));
            for (let bgimgcat of bgimgcats) {
                var bgimgcatid = $('<option value="' + bgimgcat.id + '">' + bgimgcat.name + '</option>');
                $('.bgimgcatid').append(bgimgcatid);
            }
        });
    }
    bgdeleteImg(bgimg) {
        this.editBgimgid = bgimg.id;
        $(".se-pre-con").fadeIn("slow");    
        this.http.delete(Utils.getBaseURL('/api/bgimagedelete/') + this.editBgimgid, {
            headers: this.headers
        }).subscribe(data => {
            this.getBGImages();
            this.getBgimagecategory();
            $(".se-pre-con").fadeOut("slow");    
        });
    }
    getBGImages() {
        this.http.get(Utils.getBaseURL('/api/bgimageget'), {
            headers: this.headers
        }).subscribe(data => {
            this.BgImages = JSON.parse(( < any > data)._body);
        });
    }
    getCountPatterns() {
        this.http.get(Utils.getBaseURL('/api/bgpatternget'), {
            headers: this.headers
        }).subscribe(data => {
            this.CountPatterns = JSON.parse(( < any > data)._body);
        });
    }
    getCountImports() {
        this.http.get(Utils.getBaseURL('/api/importget'), {
            headers: this.headers
        }).subscribe(data => {
            this.CountImports = JSON.parse(( < any > data)._body);
        });
    }
    getCountImages() {
        this.http.get(Utils.getBaseURL('/api/imageget'), {
            headers: this.headers
        }).subscribe(data => {
            this.CountImages = JSON.parse(( < any > data)._body);
        });
    }
    prepareBGSave(bgimgForm: NgForm): any {
        let input = new FormData();
        input.append('cat_id', bgimgForm.value.cat_id);
        for (var i = 0; i < this.imgFiles.length; i++) {
            input.append('path[]', this.imgFiles[i]);
        }
        return input;
    }
    onBgimgSubmit(bgimgForm: NgForm) {
        const formModel = this.prepareBGSave(bgimgForm);
        this.loading = true;
        this.http.post(Utils.getBaseURL('/api/bgimagesave'), formModel).subscribe(data => {
            this.loading = false;
            this.getBGImages();
            this.getBgimagecategory();
        });
        $('#bgimgform')[0].reset();
        $("#addbgimgmodal").modal('hide');
    }
    prepareeditBGimgnameSave(editBGimgForm: NgForm): any {
        let input = new FormData();
        input.append('name', editBGimgForm.value.name);
        return input;
    }
    oneditBGimgSubmit(editBGimgForm: NgForm) {
        $(".se-pre-con").fadeIn("slow");
        const formModel = this.prepareeditBGimgnameSave(editBGimgForm);
        this.loading = true;
        this.http.post(Utils.getBaseURL('/api/editbgimgname/') + this.editBgimgid, formModel).subscribe(data => {
            this.loading = false;
            this.getBGImages();
            this.getBgimagecategory();
            $(".se-pre-con").fadeOut("slow");
        });
        $('#editbgimgname')[0].reset();
        $("#editbgimgnamemodal").modal('hide');
    }
}