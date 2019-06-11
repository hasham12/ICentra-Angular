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
    selector: 'app-bgpatterns',
    templateUrl: './bgpatterns.component.html',
    styleUrls: ['./bgpatterns.component.css']
})
export class BgpatternsComponent implements OnInit {
    private editBgpatternid: any;
    public editbgpattern: any = '';
    private imgFiles = [];
    private loading: boolean = false;
    private headers = new Headers({
        'Content-Type': 'application/json'
    });
    public env = env;
    public Patterns: any[];
    public CountBgImages: any[];
    public CountImages: any[];
    public CountImports: any[];
    constructor(private http: Http, private fb: FormBuilder) {
        this.getPatterns();
        this.getBgimagecategory();
        this.getCountBGImages();
        this.getCountImports();
        this.getCountImages();
    }
    ngOnInit() {}
    editBGpatternname(pattern) {
        this.editbgpattern = pattern.name;
        this.editBgpatternid = pattern.id;
        this.editbgpatternmodal();
    }
    bgdeletePattern(pattern) {
        this.editBgpatternid = pattern.id;
        $(".se-pre-con").fadeIn("slow");    
        this.http.delete(Utils.getBaseURL('/api/bgpatterndelete/') + this.editBgpatternid, {
            headers: this.headers
        }).subscribe(data => {
            this.getPatterns();
            $(".se-pre-con").fadeOut("slow");    
        });
    }
    triggerfiletype() {
        $('#path').trigger('click');
    }
    addbgpatternmodal() {
        $("#addbgpatternmodal").modal('show');
    }
    editbgpatternmodal() {
        $("#editbgpatternnamemodal").modal('show');
    }
    onFileChange(event) {
        this.imgFiles = [];
        for (var i = 0; i < event.target.files.length; i++) {
            this.imgFiles.push(event.target.files[i]);
        }
    }
    getPatterns() {
        this.http.get(Utils.getBaseURL('/api/bgpatternget'), {
            headers: this.headers
        }).subscribe(data => {
            this.Patterns = JSON.parse(( < any > data)._body);
        });
    }
    getCountBGImages() {
        this.http.get(Utils.getBaseURL('/api/bgimageget'), {
            headers: this.headers
        }).subscribe(data => {
            this.CountBgImages = JSON.parse(( < any > data)._body);
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
    getBgimagecategory() {
        this.http.get(Utils.getBaseURL('/api/bgimagecategoryget'), {
            headers: this.headers
        }).subscribe(data => {
            let bgimgcats = JSON.parse(( < any > data)._body);
            $('.bgimgcatid').empty();
            $('.bgimgcatid').append($('<option value="">Select Category</option>'));
            for (let bgimgcat of bgimgcats) {
                var bgimgcatsettings = $('<tr><td><input type="checkbox" value="' + bgimgcat.id + '"></td><td>' + bgimgcat.id + '</td><td>' + bgimgcat.name + '</td><td><a href="javascript:void(0)"><img class="editbgImgcat" data-id="' + bgimgcat.id + '"  data-name="' + bgimgcat.name + '" src="assets/img/editor/edit-icon.png" alt="" style="height: 20px;"></a>  /<a href="javascript:void(0)"><img class="deletebgImgcat" data-id="' + bgimgcat.id + '" src="assets/img/editor/recycle.png" alt="" style="width:15px;"></a></td></tr>');
                $('#settingbgimgcat').append(bgimgcatsettings);
                var bgimgcatid = $('<option value="' + bgimgcat.id + '">' + bgimgcat.name + '</option>');
                $('.bgimgcatid').append(bgimgcatid);
            }
        });
    }
    prepareBGPSave(bgpatternForm: NgForm): any {
        let input = new FormData();
        input.append('cat_id', bgpatternForm.value.cat_id);
        for (var i = 0; i < this.imgFiles.length; i++) {
            input.append('path[]', this.imgFiles[i]);
        }
        return input;
    }
    onBgpatternSubmit(bgpatternForm: NgForm) {
        const formModel = this.prepareBGPSave(bgpatternForm);
        this.loading = true;
        this.http.post(Utils.getBaseURL('/api/bgpatternsave'), formModel).subscribe(data => {
            this.loading = false;
            this.getPatterns();
            this.getBgimagecategory();
        });
        $('#bgpatternForm')[0].reset();
        $("#addbgpatternmodal").modal('hide');
    }
    prepareeditBGpatternnameSave(editBGpatternForm: NgForm): any {
        let input = new FormData();
        input.append('name', editBGpatternForm.value.name);
        return input;
    }
    oneditBGpatternSubmit(editBGpatternForm: NgForm) {
        $(".se-pre-con").fadeIn("slow");
        const formModel = this.prepareeditBGpatternnameSave(editBGpatternForm);
        this.loading = true;
        this.http.post(Utils.getBaseURL('/api/editbgpatternname/') + this.editBgpatternid, formModel).subscribe(data => {
            this.loading = false;
            this.getPatterns();
            $(".se-pre-con").fadeOut("slow");
        });
        $('#editBGpatternForm')[0].reset();
        $("#editbgpatternnamemodal").modal('hide');
    }
}